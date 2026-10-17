"""
Tests for Tiny LLM loading, generation, and stop handling.
"""
from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)

def test_llm_load():
    res = client.post("/api/llm/load", json={
        "modelName": "Built-in Micro Transformer (INT8)",
        "contextLength": 512
    })
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True

def test_llm_generate():
    res = client.post("/api/llm/generate", json={
        "prompt": "What is FPGA acceleration?",
        "model": "Built-in Micro Transformer (INT8)",
        "maxTokens": 32,
        "temperature": 0.7,
        "backend": "cpu"
    })
    assert res.status_code == 200
    data = res.json()
    assert "text" in data
    assert len(data["text"]) > 0
    assert data["tokensGenerated"] > 0
    assert data["tokensPerSecond"] > 0
    assert data["timeToFirstTokenMs"] > 0
    assert data["backendUsed"] == "cpu"

def test_llm_stop():
    res = client.post("/api/llm/stop")
    assert res.status_code == 200
    assert res.json()["success"] is True
