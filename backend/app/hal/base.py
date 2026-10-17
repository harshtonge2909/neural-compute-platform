"""
Hardware Abstraction Layer (HAL) - Abstract Base Engine.
Defines unified interface for CPU host inference and FPGA Neural Compute Engine.
"""
from abc import ABC, abstractmethod
from typing import Dict, Any, Callable, Optional
import numpy as np
from backend.app.models.schemas import DetectionResponse, LLMGenerateResponse, BenchmarkResponse

class BaseInferenceEngine(ABC):
    @property
    @abstractmethod
    def name(self) -> str:
        pass

    @property
    @abstractmethod
    def backend_type(self) -> str:
        """'cpu' or 'fpga'"""
        pass

    @property
    @abstractmethod
    def is_available(self) -> bool:
        pass

    @abstractmethod
    def initialize(self) -> bool:
        pass

    @abstractmethod
    def get_status(self) -> Dict[str, Any]:
        pass

    @abstractmethod
    def get_capabilities(self) -> Dict[str, Any]:
        pass

    @abstractmethod
    def run_detection(
        self,
        image_np: np.ndarray,
        model_name: str = "YOLOX-Nano",
        confidence_threshold: float = 0.35,
        progress_cb: Optional[Callable[[str, int], None]] = None
    ) -> DetectionResponse:
        pass

    @abstractmethod
    def run_llm(
        self,
        prompt: str,
        model_name: str,
        max_tokens: int = 128,
        temperature: float = 0.7,
        token_cb: Optional[Callable[[str, str], None]] = None,
        stop_check: Optional[Callable[[], bool]] = None
    ) -> LLMGenerateResponse:
        pass

    @abstractmethod
    def run_benchmark(
        self,
        workload: str,
        iterations: int = 5,
        warmup_runs: int = 2,
        matrix_dimension: int = 256,
        batch_size: int = 1,
        progress_cb: Optional[Callable[[int, str], None]] = None
    ) -> BenchmarkResponse:
        pass

    @abstractmethod
    def shutdown(self):
        pass
