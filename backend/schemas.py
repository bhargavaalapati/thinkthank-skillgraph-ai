from pydantic import BaseModel
from typing import List

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