import os
import redis
from supabase import create_client, Client
from google import genai
from dotenv import load_dotenv

load_dotenv()

# Supabase Setup
supabase: Client = create_client(
    os.getenv("SUPABASE_URL"), 
    os.getenv("SUPABASE_SERVICE_ROLE_KEY")
)

# Redis Setup
redis_client = redis.Redis(
    host=os.getenv("UPSTASH_REDIS_HOST"),
    port=os.getenv("UPSTASH_REDIS_PORT"),
    password=os.getenv("UPSTASH_REDIS_TOKEN"),
    ssl=True,
    decode_responses=True 
)

# Primary Gemini Client (For Embeddings)
gemini_client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))