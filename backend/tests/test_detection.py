"""
Tests for Genuine Object Detection inference on CPU.
"""
import io
import base64
import numpy as np
from PIL import Image
from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)

def _create_sample_base64_image():
    img = Image.new("RGB", (416, 416), color=(128, 128, 128))
    buf = io.BytesIO()
    img.save(buf, format="JPEG")
    return "data:image/jpeg;base64," + base64.b64encode(buf.getvalue()).decode("utf-8")

def test_cpu_detection_inference():
    b64_img = _create_sample_base64_image()
    res = client.post("/api/detection/infer", json={
        "imageSource": b64_img,
        "modelName": "YOLOX-Nano",
        "backend": "cpu",
        "confidenceThreshold": 0.2
    })
    assert res.status_code == 200
    data = res.json()
    assert "detections" in data
    assert "inferenceTimeMs" in data
    assert data["inferenceTimeMs"] > 0
    assert data["backendUsed"] == "cpu"
    assert data["isSimulated"] is False

def test_fpga_detection_without_hardware():
    # When FPGA is selected but hardware is absent and fallback is disabled, should fail honestly
    b64_img = _create_sample_base64_image()
    res = client.post("/api/detection/infer", json={
        "imageSource": b64_img,
        "modelName": "YOLOX-Nano",
        "backend": "fpga",
        "confidenceThreshold": 0.2
    })
    # Should raise error or report failure
    assert res.status_code == 500
    assert "disconnected" in res.json()["detail"].lower()
