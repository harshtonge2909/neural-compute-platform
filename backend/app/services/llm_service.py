"""
Tiny LLM Service for NCA Platform.
Manages local small language model execution, progressive token streaming, and cancellation.
"""
import threading
from typing import Optional, Callable
from backend.app.models.schemas import LLMGenerateRequest, LLMGenerateResponse, LLMLoadRequest
from backend.app.services.device_manager import device_manager
from backend.app.services.log_service import log_service
from backend.app.services.metrics_service import metrics_service
from backend.app.config import settings_manager

class LLMService:
    def __init__(self):
        self._current_model_name = "Built-in Micro Transformer (INT8)"
        self._stop_event = threading.Event()
        self._is_generating = False

    def load_model(self, req: LLMLoadRequest) -> dict:
        log_service.add_log("MODEL", "INFO", f"Loading language model: {req.modelName}...")
        self._current_model_name = req.modelName
        settings = settings_manager.get_settings()
        if req.modelPath:
            settings.runtime.llmModelPath = req.modelPath
            settings_manager.save_settings(settings)
        log_service.add_log("MODEL", "INFO", f"Model '{req.modelName}' ready in memory (Context: {req.contextLength})")
        return {"success": True, "modelName": req.modelName, "status": "READY"}

    def stop_generation(self):
        if self._is_generating:
            self._stop_event.set()
            log_service.add_log("RUNTIME", "WARN", "User triggered LLM generation stop event")

    def generate(
        self,
        req: LLMGenerateRequest,
        token_cb: Optional[Callable[[str, str], None]] = None
    ) -> LLMGenerateResponse:
        self._stop_event.clear()
        self._is_generating = True
        log_service.add_log("MODEL", "INFO", f"Starting LLM generation: '{req.prompt[:35]}...'")

        backend = req.backend.lower()
        if backend == "fpga":
            if not device_manager.fpga_engine.is_available:
                if settings_manager.get_settings().hardware.allowSimulationFallback:
                    log_service.add_log("COMM", "WARN", "FPGA disconnected; running LLM on CPU per fallback policy")
                    engine = device_manager.cpu_engine
                else:
                    self._is_generating = False
                    log_service.add_log("COMM", "ERROR", "FPGA hardware disconnected. Cannot fulfill FPGA LLM request.")
                    raise RuntimeError("FPGA hardware accelerator is disconnected. Please select CPU backend.")
            else:
                engine = device_manager.fpga_engine
        else:
            engine = device_manager.cpu_engine

        try:
            result = engine.run_llm(
                prompt=req.prompt,
                model_name=req.model or self._current_model_name,
                max_tokens=req.maxTokens,
                temperature=req.temperature,
                token_cb=token_cb,
                stop_check=lambda: self._stop_event.is_set()
            )
            
            # Record metrics
            metrics_service.record_snapshot(latency_ms=result.timeToFirstTokenMs, throughputFps=result.tokensPerSecond)
            log_service.add_log("PERF", "PERF", f"LLM completed: {result.tokensGenerated} tokens at {result.tokensPerSecond} tok/s (TTFT: {result.timeToFirstTokenMs}ms)")
            return result
        finally:
            self._is_generating = False

llm_service = LLMService()
