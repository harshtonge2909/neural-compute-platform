"""
Model Management API Routes.
"""
from fastapi import APIRouter
from backend.app.config import MODELS_DIR

router = APIRouter(prefix="/api/models", tags=["models"])

@router.get("")
def list_models():
    detection_models = []
    # Check on-disk ONNX models
    if (MODELS_DIR / "yolox_nano.onnx").exists():
        detection_models.append({
            "id": "yolox-nano",
            "name": "YOLOX-Nano",
            "format": "ONNX",
            "precision": "FP32",
            "inputResolution": "416x416",
            "sizeMb": round((MODELS_DIR / "yolox_nano.onnx").stat().st_size / (1024*1024), 2),
            "status": "READY"
        })
    if (MODELS_DIR / "yolov5n.onnx").exists():
        detection_models.append({
            "id": "yolov5n",
            "name": "YOLOv5n",
            "format": "ONNX",
            "precision": "FP16",
            "inputResolution": "640x640",
            "sizeMb": round((MODELS_DIR / "yolov5n.onnx").stat().st_size / (1024*1024), 2),
            "status": "READY"
        })

    llm_models = [
        {
            "id": "builtin-micro-llm",
            "name": "Built-in Micro Transformer (INT8)",
            "format": "Autoregressive Engine",
            "precision": "INT8 Quantized",
            "parameters": "15M",
            "contextLength": 512,
            "status": "INSTALLED"
        },
        {
            "id": "external-gguf",
            "name": "Local GGUF Model (TinyLlama / Qwen)",
            "format": "GGUF",
            "precision": "Q4_K_M",
            "parameters": "1.1B",
            "contextLength": 2048,
            "status": "CONFIGURABLE"
        }
    ]

    return {
        "detectionModels": detection_models,
        "llmModels": llm_models
    }
