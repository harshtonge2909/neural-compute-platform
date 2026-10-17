"""
Application Settings API Routes.
"""
from fastapi import APIRouter
from backend.app.models.schemas import AppSettings
from backend.app.config import settings_manager
from backend.app.services.log_service import log_service

router = APIRouter(prefix="/api/settings", tags=["settings"])

@router.get("", response_model=AppSettings)
def get_settings():
    return settings_manager.get_settings()

@router.post("", response_model=AppSettings)
def update_settings(new_settings: AppSettings):
    saved = settings_manager.save_settings(new_settings)
    log_service.add_log("RUNTIME", "INFO", "Application settings updated and persisted")
    return saved
