from fastapi import FastAPI
from app.routes import router as api_router
from app.database import engine, Base
import app.models

from app.auth import router as auth_router

Base.metadata.create_all(bind=engine)

app = FastAPI()
app.include_router(api_router)

app.include_router(auth_router)

@app.get("/")
def home():
    return {"message": "Smart Clinical Advisor Backend Running"}