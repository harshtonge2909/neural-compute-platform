"""
Health check route.
"""
from fastapi import APIRouter
from backend.app.services.device_manager import device_manager

router = APIRouter(prefix="/api", tags=["health"])

@router.get("/health")
def get_health():
    return {
        "status": "healthy",
        "service": "Neural Computing Architecture (NCA) Backend",
        "version": "2.4.0",
        "hardwareConnected": device_manager.fpga_engine.is_available,
        "activeBackend": "fpga" if device_manager.fpga_engine.is_available else "cpu"
    }
