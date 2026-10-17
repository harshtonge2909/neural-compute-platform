"""
Device Management API Routes.
"""
from typing import List
from fastapi import APIRouter, HTTPException
from backend.app.models.schemas import DeviceInfo, DeviceConnectRequest
from backend.app.services.device_manager import device_manager

router = APIRouter(prefix="/api/devices", tags=["devices"])

@router.get("", response_model=List[DeviceInfo])
def list_devices():
    return device_manager.discover_devices()

@router.get("/{device_id}/status")
def get_device_status(device_id: str):
    devices = device_manager.discover_devices()
    for d in devices:
        if d.id == device_id:
            return d
    raise HTTPException(status_code=404, detail="Device not found")

@router.post("/connect")
def connect_device(req: DeviceConnectRequest):
    result = device_manager.connect_device(req.deviceId, req.parameters)
    return result

@router.post("/{device_id}/disconnect")
def disconnect_device(device_id: str):
    return device_manager.disconnect_device(device_id)

@router.post("/loopback")
def test_loopback():
    return device_manager.test_hardware_loopback()
