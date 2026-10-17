"""
Tests for Device discovery, connection handling, and loopback.
"""
from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)

def test_list_devices():
    res = client.get("/api/devices")
    assert res.status_code == 200
    devices = res.json()
    assert isinstance(devices, list)
    assert len(devices) >= 2
    ids = [d["id"] for d in devices]
    assert "milkv-mars-net" in ids
    assert "fpga-char-dev" in ids

def test_device_connection_failure_handling():
    # Attempt connecting to invalid host
    res = client.post("/api/devices/connect", json={
        "deviceId": "milkv-mars-net",
        "parameters": {"targetHost": "192.0.2.1", "targetPort": 9999}
    })
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is False
    assert data["status"] == "DISCONNECTED"

def test_loopback_disconnected():
    # Loopback should report failure honestly when hardware is disconnected
    res = client.post("/api/devices/loopback")
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is False
    assert "not connected" in data["error"].lower()
