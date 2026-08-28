import os
import json
import traceback
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from google import genai
from google.genai import types
from supabase import create_client, Client
from dotenv import load_dotenv
import redis

load_dotenv()

app = FastAPI(title="SkillGraph AI Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://thinkthank-skillgraph-ai.vercel.app",
        "http://localhost:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------------------------------------------------
# INFRASTRUCTURE SETUP
# -------------------------------------------------------------------
supabase: Client = create_client(
    os.getenv("SUPABASE_URL"), 
    os.getenv("SUPABASE_SERVICE_ROLE_KEY")
)

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

# decode_responses=True ensures Redis returns strings, not bytes.
redis_client = redis.Redis(
    host=os.getenv("UPSTASH_REDIS_HOST"),
    port=os.getenv("UPSTASH_REDIS_PORT"),
    password=os.getenv("UPSTASH_REDIS_TOKEN"),
    ssl=True,
    decode_responses=True 
)

# -------------------------------------------------------------------
# SCHEMAS
# -------------------------------------------------------------------
class AssessmentRequest(BaseModel):
    user_id: str
    role: str
    focus_area: str

class DocumentChunk(BaseModel):
    user_id: str
    text: str
    document_name: str

class QuestionModel(BaseModel):
    id: str
    scenario: str
    options: List[str]

class AssessmentResponse(BaseModel):
    questions: List[QuestionModel]

class UserAnswer(BaseModel):
    question_id: str
    scenario: str
    selected_answer: str

class EvaluationRequest(BaseModel):
    user_id: str
    role: str
    answers: List[UserAnswer]

class SkillScore(BaseModel):
    competency_name: str
    competency_type: str
    score: int
    justification: str

class EvaluationResponse(BaseModel):
    scores: List[SkillScore]
    overall_feedback: str

# -------------------------------------------------------------------
# CORE SERVICES (Rate Limiting, Caching, Retrieval)
# -------------------------------------------------------------------
def check_rate_limit(user_id: str, limit: int = 5, window: int = 60):
    """Enterprise rate limiter with fail-open safety."""
    try:
        key = f"rate_limit:{user_id}"
        current = redis_client.get(key)
        
        if current and int(current) >= limit:
            raise HTTPException(status_code=429, detail="Rate limit exceeded.")
        
        pipe = redis_client.pipeline()
        pipe.incr(key)
        pipe.expire(key, window)
        pipe.execute()
    except HTTPException:
        raise
    except Exception as e:
        print(f"⚠️ Redis bypass (Rate Limiter): {e}")

async def retrieve_context(query: str) -> str:
    """Vector search with Redis caching layer for speed and cost savings."""
    cache_key = f"rag_cache:{query.replace(' ', '_')}"
    
    try:
        # 1. Check Redis Cache First
        cached_context = redis_client.get(cache_key)
        if cached_context:
            print("⚡ Cache Hit for Retrieval")
            return cached_context

        # 2. Cache Miss: Generate Embedding
        print("🔍 Cache Miss. Embedding query...")
        response = client.models.embed_content(
            model='gemini-embedding-001',
            contents=query,
            config=types.EmbedContentConfig(output_dimensionality=768)
        )
        query_embedding = response.embeddings[0].values
        
        # 3. Vector DB Search
        result = supabase.rpc(
            'match_documents', 
            {'query_embedding': query_embedding, 'match_threshold': 0.7, 'match_count': 3}
        ).execute()
        
        if not result.data:
            return "No specific policy context found."
            
        # 4. Cache and Return
        context = "\n\n".join([doc['content'] for doc in result.data])
        try:
            redis_client.setex(cache_key, 3600, context) # Cache for 1 hour
        except Exception as e:
            print(f"⚠️ Redis cache set failed: {e}")
            
        return context
        
    except Exception as e:
        print(f"Retrieval error: {e}")
        traceback.print_exc()
        return ""

# -------------------------------------------------------------------
# ROUTERS
# -------------------------------------------------------------------
@app.post("/api/ingest-policy")
async def ingest_policy(req: DocumentChunk):
    check_rate_limit(req.user_id, limit=10)
    try:
        response = client.models.embed_content(
            model='gemini-embedding-001',
            contents=req.text,
            config=types.EmbedContentConfig(output_dimensionality=768)
        )
        embedding = response.embeddings[0].values
        
        supabase.table('policy_documents').insert({
            "content": req.text,
            "metadata": {"document_name": req.document_name},
            "embedding": embedding
        }).execute()
        
        return {"status": "success", "message": "Policy ingested and vectorized."}
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/generate-assessment")
async def generate_assessment(req: AssessmentRequest):
    check_rate_limit(req.user_id)
    
    search_query = f"{req.role} {req.focus_area} policy mandate"
    retrieved_context = await retrieve_context(search_query)
    
    prompt = f"""
    Create a 3-question Situational Judgment Test for a {req.role} focusing on {req.focus_area}. 
    Provide complex, real-world administrative scenarios.
    
    GROUNDING CONTEXT:
    {retrieved_context}
    """
    
    # 3-Attempt Retry Block for LLM Reliability
    for attempt in range(3):
        try:
            response = client.models.generate_content(
                model='gemini-2.5-flash',
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    response_schema=AssessmentResponse,
                    system_instruction="You are an expert Assessor aligned with India's Karmayogi Competency Model. Generate situational questions grounded in the provided policy context."
                )
            )
            
            # Use the new SDK's parsed object
            if response.parsed:
                return response.parsed.model_dump()
            else:
                clean_text = response.text.strip('```json').strip('```').strip()
                return json.loads(clean_text)
                
        except Exception as e:
            print(f"Generation Attempt {attempt + 1} Failed: {e}")
            if attempt == 2:
                traceback.print_exc()
                raise HTTPException(status_code=500, detail="Failed to generate assessment.")

@app.post("/api/evaluate-assessment")
async def evaluate_assessment(req: EvaluationRequest):
    check_rate_limit(req.user_id)
    
    answers_text = "\n".join([f"Scenario: {a.scenario}\nUser Chose: {a.selected_answer}" for a in req.answers])
    prompt = f"Evaluate these responses for a {req.role}:\n{answers_text}\nScore on 3 KCM competencies from 1 to 10."
    
    for attempt in range(3):
        try:
            response = client.models.generate_content(
                model='gemini-2.5-flash',
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    response_schema=EvaluationResponse,
                    system_instruction="You are an Evaluator Agent. Provide deterministic justifications based ONLY on the user's selected answers."
                )
            )
            
            if response.parsed:
                data = response.parsed.model_dump()
            else:
                clean_text = response.text.strip('```json').strip('```').strip()
                data = json.loads(clean_text)
            
            # 1. Ensure profile exists to satisfy foreign key constraint
            supabase.table("profiles").upsert({
                "id": req.user_id,
                "full_name": "Karmayogi Candidate",
                "role": req.role
            }, on_conflict="id").execute()
            
            # 2. Safely write scores to Supabase
            for score in data.get('scores', []):
                supabase.table('competency_scores').insert({
                    "user_id": req.user_id,
                    "competency_type": score.get('competency_type', 'KCM'),
                    "competency_name": score.get('competency_name', 'Skill'),
                    "score": score.get('score', 0),
                    "justification": score.get('justification', '')
                }).execute()
                
            return data
            
        except Exception as e:
            print(f"Evaluation Attempt {attempt + 1} Failed: {e}")
            if attempt == 2:
                traceback.print_exc()
                raise HTTPException(status_code=500, detail="Evaluation failed after multiple attempts.")