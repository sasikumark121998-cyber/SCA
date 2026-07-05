"""Pydantic schemas placeholder."""
from pydantic import BaseModel

class RegisterRequest(BaseModel):
    username : str
    email : str
    password : str

class LoginRequest(BaseModel):
    email : str
    password :str

class DiagnosisRequest(BaseModel):
    symptoms : str
    medical_history: str

class FeedbackRequest(BaseModel):
    query_id: int
    rating: int
    comments: str

class Token(BaseModel):
    access_token: str
    token_type: str