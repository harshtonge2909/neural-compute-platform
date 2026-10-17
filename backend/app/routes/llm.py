"""
Tiny LLM Routes.
"""
from fastapi import APIRouter, HTTPException
from backend.app.models.schemas import (
    LLMLoadRequest, LLMGenerateRequest, LLMGenerateResponse
)
from backend.app.services.llm_service import llm_service

router = APIRouter(prefix="/api/llm", tags=["llm"])

@router.post("/load")
def load_llm(req: LLMLoadRequest):
    try:
        return llm_service.load_model(req)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/generate", response_model=LLMGenerateResponse)
def generate_llm(req: LLMGenerateRequest):
    try:
        return llm_service.generate(req)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/stop")
def stop_llm():
    llm_service.stop_generation()
    return {"success": True, "message": "Stop signal sent to LLM engine"}
