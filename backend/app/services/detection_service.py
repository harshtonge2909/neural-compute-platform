"""
Object Detection Service for NCA Platform.
Orchestrates genuine image processing and routing between CPU and FPGA backends.
"""
import io
import base64
import numpy as np
from PIL import Image
from typing import Optional, Callable
from backend.app.models.schemas import DetectionRequest, DetectionResponse
from backend.app.services.device_manager import device_manager
from backend.app.services.metrics_service import metrics_service
from backend.app.services.log_service import log_service
from backend.app.config import settings_manager

class DetectionService:
    def decode_image(self, source: str) -> np.ndarray:
        if source.startswith("data:image"):
            # Strip base64 prefix
            header, data = source.split(",", 1)
            img_bytes = base64.b64decode(data)
            pil_img = Image.open(io.BytesIO(img_bytes)).convert("RGB")
            return np.array(pil_img)
        elif source.startswith("http://") or source.startswith("https://"):
            import urllib.request
            req = urllib.request.Request(source, headers={'User-Agent': 'Mozilla/5.0'})
            with urllib.request.urlopen(req, timeout=5) as resp:
                pil_img = Image.open(io.BytesIO(resp.read())).convert("RGB")
                return np.array(pil_img)
        else:
            # Generate a clear procedural test pattern with shapes
            img = np.zeros((416, 416, 3), dtype=np.uint8)
            img[50:200, 50:200] = [200, 50, 50]  # Red box
            img[220:380, 150:350] = [50, 180, 50] # Green box
            return img

    def run_detection(
        self,
        req: DetectionRequest,
        progress_cb: Optional[Callable[[str, int], None]] = None
    ) -> DetectionResponse:
        log_service.add_log("MODEL", "INFO", f"Object detection request: Model={req.modelName}, Backend={req.backend.upper()}")
        img_np = self.decode_image(req.imageSource)

        backend = req.backend.lower()
        if backend == "fpga":
            if not device_manager.fpga_engine.is_available:
                allow_fallback = settings_manager.get_settings().hardware.allowSimulationFallback
                if allow_fallback:
                    log_service.add_log("COMM", "WARN", "FPGA disconnected; falling back to CPU execution per user policy")
                    engine = device_manager.cpu_engine
                else:
                    log_service.add_log("COMM", "ERROR", "FPGA hardware disconnected. Cannot fulfill FPGA inference request.")
                    raise RuntimeError("FPGA hardware accelerator is disconnected. Please select CPU backend or connect hardware.")
            else:
                engine = device_manager.fpga_engine
        else:
            engine = device_manager.cpu_engine

        result = engine.run_detection(
            image_np=img_np,
            model_name=req.modelName,
            confidence_threshold=req.confidenceThreshold,
            progress_cb=progress_cb
        )

        # Record metrics snapshot
        metrics_service.record_snapshot(latency_ms=result.inferenceTimeMs, throughput_fps=result.fps)
        log_service.add_log("PERF", "PERF", f"Detection complete: {result.totalObjects} objects found in {result.inferenceTimeMs}ms ({result.fps} FPS) on {result.backendUsed.upper()}")

        return result

detection_service = DetectionService()
