"""
Object Detection Routes.
"""
import io
import base64
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from PIL import Image
from backend.app.models.schemas import DetectionRequest, DetectionResponse
from backend.app.services.detection_service import detection_service

router = APIRouter(prefix="/api/detection", tags=["detection"])

@router.post("/infer", response_model=DetectionResponse)
def infer_detection(req: DetectionRequest):
    try:
        return detection_service.run_detection(req)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/upload")
async def upload_image_for_detection(
    file: UploadFile = File(...),
    modelName: str = Form(default="YOLOX-Nano"),
    backend: str = Form(default="cpu"),
    confidenceThreshold: float = Form(default=0.35)
):
    try:
        contents = await file.read()
        pil_img = Image.open(io.BytesIO(contents)).convert("RGB")
        
        # Convert to base64 data URI
        buffered = io.BytesIO()
        pil_img.save(buffered, format="JPEG")
        b64_str = "data:image/jpeg;base64," + base64.b64encode(buffered.getvalue()).decode("utf-8")

        req = DetectionRequest(
            imageSource=b64_str,
            modelName=modelName,
            backend=backend,
            confidenceThreshold=confidenceThreshold
        )
        return detection_service.run_detection(req)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
