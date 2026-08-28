import os
import traceback
from fastapi import HTTPException
from google import genai
from google.genai import types
from config import redis_client, supabase, gemini_client

def check_rate_limit(user_id: str, limit: int = 5, window: int = 60):
    """Enterprise rate limiter via Upstash Redis."""
    try:
        key = f"rate_limit:{user_id}"
        current = redis_client.get(key)
        
        if current and int(current) >= limit:
            raise HTTPException(status_code=429, detail="Rate limit exceeded. Please wait.")
        
        pipe = redis_client.pipeline()
        pipe.incr(key)
        pipe.expire(key, window)
        pipe.execute()
    except HTTPException:
        raise
    except Exception as e:
        print(f"⚠️ Redis bypass (Rate Limiter): {e}")

async def retrieve_context(query: str) -> str:
    """Vector search with Redis caching layer."""
    cache_key = f"rag_cache:{query.replace(' ', '_')}"
    try:
        cached_context = redis_client.get(cache_key)
        if cached_context:
            return cached_context

        response = gemini_client.models.embed_content(
            model='gemini-embedding-001',
            contents=query,
            config=types.EmbedContentConfig(output_dimensionality=768)
        )
        
        result = supabase.rpc(
            'match_documents', 
            {'query_embedding': response.embeddings[0].values, 'match_threshold': 0.7, 'match_count': 3}
        ).execute()
        
        if not result.data:
            return "No specific policy context found."
            
        context = "\n\n".join([doc['content'] for doc in result.data])
        redis_client.setex(cache_key, 3600, context)
        return context
    except Exception as e:
        traceback.print_exc()
        return ""

def generate_with_rotation(prompt: str, system_instruction: str, schema=None):
    """Invincible Gemini caller that rotates keys on 429 Quota errors."""
    api_keys = [os.getenv("GEMINI_API_KEY"), os.getenv("GEMINI_API_KEY_2")]
    valid_keys = [k for k in api_keys if k] 

    for key in valid_keys:
        try:
            temp_client = genai.Client(api_key=key)
            
            config_kwargs = {
                "response_mime_type": "application/json",
                "system_instruction": system_instruction
            }
            if schema:
                config_kwargs["response_schema"] = schema

            return temp_client.models.generate_content(
                model='gemini-3.6-flash',
                contents=prompt,
                config=types.GenerateContentConfig(**config_kwargs)
            )
        except Exception as e:
            print(f"⚠️ Key failed (Likely 429). Swapping to backup key... Error: {e}")
            continue 

    raise HTTPException(status_code=429, detail="All AI API keys exhausted.")