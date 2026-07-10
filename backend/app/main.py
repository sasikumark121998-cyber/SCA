from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes import router as api_router
from app.database import engine, Base
import app.models

from app.auth import router as auth_router

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Smart Clinical Advisor - HyDE Enhanced RAG")

# CORS - allows your React/Streamlit frontend to call this API from a browser.
# NOTE: allow_origins=["*"] is fine for local dev/demo. For production,
# replace "*" with your actual frontend URL(s).
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)
app.include_router(auth_router)


@app.get("/")
def home():
    return {"message": "Smart Clinical Advisor Backend Running"}
