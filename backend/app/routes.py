from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.auth import get_current_user
from app.models import QueryLog, Feedback
from app.schemas import DiagnosisRequest, FeedbackRequest

router = APIRouter(
    prefix="/api",
    tags=["Smart Clinical Advisor"]
)


# ===========================
# Profile
# ===========================

@router.get("/profile")
def profile(current_user=Depends(get_current_user)):
    return {
        "id": current_user.id,
        "username": current_user.username,
        "email": current_user.email
    }


# ===========================
# Diagnosis
# ===========================

@router.post("/diagnosis")
def diagnosis(
    request: DiagnosisRequest,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    diagnosis_result = "AI Diagnosis will be generated later"

    confidence = 0.90

    new_query = QueryLog(
        user_id=current_user.id,
        patient_name=current_user.username,
        symptoms=request.symptoms,
        medical_history=request.medical_history,
        diagnosis=diagnosis_result,
        confidence_score=confidence
    )

    db.add(new_query)
    db.commit()
    db.refresh(new_query)

    return {
        "message": "Diagnosis Generated Successfully",
        "query_id": new_query.id,
        "patient": current_user.username,
        "symptoms": request.symptoms,
        "medical_history": request.medical_history,
        "diagnosis": diagnosis_result,
        "confidence_score": confidence
    }


# ===========================
# History
# ===========================

@router.get("/history")
def history(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    history = db.query(QueryLog).filter(
        QueryLog.user_id == current_user.id
    ).all()

    return history


# ===========================
# Get Single Diagnosis
# ===========================

@router.get("/history/{query_id}")
def history_by_id(
    query_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    query = db.query(QueryLog).filter(
        QueryLog.id == query_id,
        QueryLog.user_id == current_user.id
    ).first()

    if not query:
        raise HTTPException(
            status_code=404,
            detail="Diagnosis Not Found"
        )

    return query


# ===========================
# Delete History
# ===========================

@router.delete("/history/{query_id}")
def delete_history(
    query_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    query = db.query(QueryLog).filter(
        QueryLog.id == query_id,
        QueryLog.user_id == current_user.id
    ).first()

    if not query:
        raise HTTPException(
            status_code=404,
            detail="History Not Found"
        )

    db.delete(query)
    db.commit()

    return {
        "message": "History Deleted Successfully"
    }


# ===========================
# Feedback
# ===========================

@router.post("/feedback")
def feedback(
    request: FeedbackRequest,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    query = db.query(QueryLog).filter(
        QueryLog.id == request.query_id,
        QueryLog.user_id == current_user.id
    ).first()

    if not query:
        raise HTTPException(
            status_code=404,
            detail="Diagnosis Not Found"
        )

    new_feedback = Feedback(
        query_id=request.query_id,
        rating=request.rating,
        comments=request.comments
    )

    db.add(new_feedback)
    db.commit()
    db.refresh(new_feedback)

    return {
        "message": "Feedback Submitted Successfully",
        "feedback_id": new_feedback.id
    }


# ===========================
# Dashboard
# ===========================

@router.get("/dashboard")
def dashboard(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    total_queries = db.query(QueryLog).filter(
        QueryLog.user_id == current_user.id
    ).count()

    return {
        "username": current_user.username,
        "email": current_user.email,
        "total_diagnosis": total_queries
    }