import json
import traceback
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from google.genai import types

# Import from our new modules
from config import supabase, gemini_client
from schemas import (
    AssessmentRequest, DocumentChunk, EvaluationRequest, 
    AssessmentResponse, EvaluationResponse
)
from services import check_rate_limit, retrieve_context, generate_with_rotation

app = FastAPI(title="SkillGraph AI Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://thinkthank-skillgraph-ai.vercel.app", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/ingest-policy")
async def ingest_policy(req: DocumentChunk):
    check_rate_limit(req.user_id, limit=10)
    try:
        response = gemini_client.models.embed_content(
            model='gemini-embedding-001',
            contents=req.text,
            config=types.EmbedContentConfig(output_dimensionality=768)
        )
        
        supabase.table('policy_documents').insert({
            "content": req.text,
            "metadata": {"document_name": req.document_name},
            "embedding": response.embeddings[0].values
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
    
    response = generate_with_rotation(
        prompt=prompt,
        system_instruction="You are an expert Assessor aligned with India's Karmayogi Competency Model. Generate situational questions grounded in the provided policy context.",
        schema=AssessmentResponse
    )
    
    if response.parsed:
        return response.parsed.model_dump()
    return json.loads(response.text.strip('```json').strip('```').strip())


@app.post("/api/evaluate-assessment")
async def evaluate_assessment(req: EvaluationRequest):
    check_rate_limit(req.user_id)
    
    answers_text = "\n".join([f"Scenario: {a.scenario}\nUser Chose: {a.selected_answer}" for a in req.answers])
    prompt = f"Evaluate these responses for a {req.role}:\n{answers_text}\nScore on 3 KCM competencies from 1 to 10."
    
    response = generate_with_rotation(
        prompt=prompt,
        system_instruction="You are an Evaluator Agent. Provide deterministic justifications based ONLY on the user's selected answers.",
        schema=EvaluationResponse
    )
    
    data = response.parsed.model_dump() if response.parsed else json.loads(response.text.strip('```json').strip('```').strip())
    
    try:
        supabase.table("profiles").upsert({
            "id": req.user_id,
            "full_name": "Karmayogi Candidate",
            "role": req.role
        }, on_conflict="id").execute()
        
        for score in data.get('scores', []):
            supabase.table('competency_scores').insert({
                "user_id": req.user_id,
                "competency_type": score.get('competency_type', 'KCM'),
                "competency_name": score.get('competency_name', 'Skill'),
                "score": score.get('score', 0),
                "justification": score.get('justification', '')
            }).execute()
    except Exception as db_err:
        print(f"⚠️ DB Logging Failed, but returning evaluation: {db_err}")
        
    return data