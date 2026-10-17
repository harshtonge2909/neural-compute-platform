"""
Tests for Benchmark runner (Matrix Multiplication, Convolution, Honest FPGA reporting).
"""
from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)

def test_cpu_matrix_multiplication_benchmark():
    res = client.post("/api/benchmark/run", json={
        "workload": "Matrix Multiplication",
        "backend": "cpu",
        "iterations": 3,
        "warmupRuns": 1,
        "matrixDimension": 64
    })
    assert res.status_code == 200
    data = res.json()
    assert data["workload"] == "Matrix Multiplication"
    assert data["backend"] == "cpu"
    assert data["latencyMs"] > 0
    assert data["throughputFps"] > 0
    assert data["isAvailable"] is True

def test_cpu_convolution_benchmark():
    res = client.post("/api/benchmark/run", json={
        "workload": "Convolution",
        "backend": "cpu",
        "iterations": 2,
        "warmupRuns": 1,
        "matrixDimension": 64
    })
    assert res.status_code == 200
    data = res.json()
    assert data["workload"] == "Convolution"
    assert data["backend"] == "cpu"
    assert data["latencyMs"] > 0

def test_fpga_benchmark_honestly_unavailable():
    res = client.post("/api/benchmark/run", json={
        "workload": "Matrix Multiplication",
        "backend": "fpga",
        "iterations": 3,
        "warmupRuns": 1,
        "matrixDimension": 64
    })
    assert res.status_code == 200
    data = res.json()
    assert data["backend"] == "fpga"
    assert data["isAvailable"] is False
    assert "Disconnected" in data["statusMessage"]
