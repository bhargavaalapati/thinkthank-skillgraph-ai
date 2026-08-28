import os
import json
import resend
import redis
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from google import genai
from google.genai import types
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()
resend.api_key = os.getenv("RESEND_API_KEY")

app = FastAPI(title="SkillGraph AI Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Upstash Redis
redis_client = redis.Redis(
    host=os.getenv("UPSTASH_REDIS_HOST"),
    port=os.getenv("UPSTASH_REDIS_PORT"),
    password=os.getenv("UPSTASH_REDIS_TOKEN"),
    ssl=True
)

supabase: Client = create_client(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_SERVICE_ROLE_KEY"))
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

# --- Schemas ---
class AssessmentRequest(BaseModel):
    user_id: str  # Added for rate limiting
    role: str
    focus_area: str

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

#----
def send_scorecard_email(to_email: str, scores: list, feedback: str):
    html_content = f"""
    <h2>SkillGraph AI Competency Assessment</h2>
    <p>{feedback}</p>
    <ul>
    """ + "".join([f"<li><strong>{s['competency_name']}</strong>: {s['score']}/10 - {s['justification']}</li>" for s in scores]) + "</ul>"

    resend.Emails.send({
        "from": "onboarding@resend.dev",
        "to": to_email,
        "subject": "Your Karmayogi Competency Scorecard",
        "html": html_content
    })

def check_rate_limit(user_id: str):
    """Allows 5 assessment generations per minute per user."""
    key = f"rate_limit:{user_id}"
    current = redis_client.get(key)
    
    if current and int(current) >= 5:
        raise HTTPException(status_code=429, detail="Rate limit exceeded. Please wait 60 seconds.")
    
    pipe = redis_client.pipeline()
    pipe.incr(key)
    pipe.expire(key, 60)
    pipe.execute()

# --- Endpoints ---

@app.get("/api/health")
async def health_check():
    return {"status": "ok"}

@app.post("/api/generate-assessment")
async def generate_assessment(req: AssessmentRequest):
    # 1. Check Rate Limit instantly
    check_rate_limit(req.user_id)

    prompt = f"Create a 3-question Situational Judgment Test for a {req.role} focusing on {req.focus_area}. Provide complex, real-world administrative scenarios."
    try:
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=AssessmentResponse,
                system_instruction="You are an expert Assessor aligned with India's Karmayogi Competency Model. Generate situational questions."
            )
        )
        return json.loads(response.text)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/evaluate-assessment")
async def evaluate_assessment(req: EvaluationRequest):
    answers_text = "\n".join([f"Scenario: {a.scenario}\nUser Chose: {a.selected_answer}" for a in req.answers])
    # 1. Check Rate Limit instantly
    check_rate_limit(req.user_id)
    
    prompt = f"Evaluate these responses for a {req.role}:\n{answers_text}\nScore on 3 KCM competencies (e.g., Solution Orientation) from 1 to 10."
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
        data = json.loads(response.text)
        
        if req.user_id != "test_user":
            for score in data['scores']:
                supabase.table('competency_scores').insert({
                    "user_id": req.user_id,
                    "competency_type": score['competency_type'],
                    "competency_name": score['competency_name'],
                    "score": score['score'],
                    "justification": score['justification']
                }).execute()
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))