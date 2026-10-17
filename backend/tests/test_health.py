"""
Tests for Health and System Status endpoints.
"""
from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)

def test_health():
    res = client.get("/api/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "healthy"
    assert "service" in data

def test_system_status():
    res = client.get("/api/system/status")
    assert res.status_code == 200
    data = res.json()
    assert "host" in data
    assert "processor" in data
    assert "memoryUsageMb" in data
    assert data["runtimeStatus"] == "RUNNING"

def test_nce_status():
    res = client.get("/api/nce/status")
    assert res.status_code == 200
    data = res.json()
    # FPGA is disconnected in dev environment, so isAvailable should be False honestly
    assert data["isAvailable"] is False
    assert len(data["statusMessage"]) > 0

def test_metrics_history():
    res = client.get("/api/metrics")
    assert res.status_code == 200
    data = res.json()
    assert isinstance(data, list)
    assert len(data) > 0
