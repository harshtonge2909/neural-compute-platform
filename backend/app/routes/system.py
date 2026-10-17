"""
System and Telemetry Routes.
"""
from typing import Optional, List
from fastapi import APIRouter, Query
from backend.app.models.schemas import (
    SystemStatusResponse, NCEStatusResponse, MetricSnapshot, LogEntry
)
from backend.app.services.metrics_service import metrics_service
from backend.app.services.device_manager import device_manager
from backend.app.services.log_service import log_service

router = APIRouter(prefix="/api", tags=["system"])

@router.get("/system/status", response_model=SystemStatusResponse)
def get_system_status():
    return metrics_service.get_system_status()

@router.get("/nce/status", response_model=NCEStatusResponse)
def get_nce_status():
    return device_manager.fpga_engine.get_nce_telemetry()

@router.get("/metrics", response_model=List[MetricSnapshot])
def get_metrics_history():
    return metrics_service.get_history()

@router.get("/logs", response_model=List[LogEntry])
def get_logs(
    limit: int = Query(default=100, ge=1, le=500),
    level: Optional[str] = None,
    module: Optional[str] = None
):
    return log_service.get_logs(limit=limit, level=level, module=module)

@router.post("/logs/clear")
def clear_logs():
    log_service.clear_logs()
    return {"success": True, "message": "Logs cleared"}
