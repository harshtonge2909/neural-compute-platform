"""
Tests for Settings persistence and validation.
"""
from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)

def test_get_settings():
    res = client.get("/api/settings")
    assert res.status_code == 200
    data = res.json()
    assert "general" in data
    assert "runtime" in data
    assert "hardware" in data
    assert "benchmarks" in data

def test_update_settings():
    # Fetch current
    res = client.get("/api/settings")
    current = res.json()
    
    # Modify theme and confidence
    current["general"]["theme"] = "light"
    current["runtime"]["confidenceThreshold"] = 0.42

    post_res = client.post("/api/settings", json=current)
    assert post_res.status_code == 200
    updated = post_res.json()
    assert updated["runtime"]["confidenceThreshold"] == 0.42

    # Re-fetch to ensure persistence
    res2 = client.get("/api/settings")
    assert res2.json()["runtime"]["confidenceThreshold"] == 0.42
