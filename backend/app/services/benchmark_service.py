"""
Benchmark Runner Service for NCA Platform.
Executes genuine matrix multiplications, convolutions, detection, and LLM workloads.
Reports honest measurements without fabricated speedups.
"""
from typing import Optional, Callable
from backend.app.models.schemas import BenchmarkRequest, BenchmarkResponse
from backend.app.services.device_manager import device_manager
from backend.app.services.log_service import log_service
from backend.app.services.metrics_service import metrics_service

class BenchmarkService:
    def run_benchmark(
        self,
        req: BenchmarkRequest,
        progress_cb: Optional[Callable[[int, str], None]] = None
    ) -> BenchmarkResponse:
        log_service.add_log("PERF", "INFO", f"Starting benchmark: Workload='{req.workload}', Backend={req.backend.upper()}, Iterations={req.iterations}")

        backend = req.backend.lower()
        if backend == "fpga":
            if not device_manager.fpga_engine.is_available:
                log_service.add_log("COMM", "WARN", "FPGA benchmark requested but hardware is disconnected")
                return BenchmarkResponse(
                    id=f"bm-fpga-disconnected",
                    timestamp="",
                    workload=req.workload,
                    backend="fpga",
                    latencyMs=0.0,
                    minLatencyMs=0.0,
                    maxLatencyMs=0.0,
                    throughputFps=0.0,
                    cpuUtilization=0.0,
                    fpgaUtilization=None,
                    memoryUsageMb=0.0,
                    energyJoules=None,
                    powerWatts=None,
                    speedupFactor=None,
                    isSimulated=False,
                    isAvailable=False,
                    statusMessage="Unavailable (FPGA Hardware Disconnected)"
                )
            engine = device_manager.fpga_engine
        else:
            engine = device_manager.cpu_engine

        result = engine.run_benchmark(
            workload=req.workload,
            iterations=req.iterations,
            warmup_runs=req.warmupRuns,
            matrix_dimension=req.matrixDimension,
            batch_size=req.batchSize,
            progress_cb=progress_cb
        )

        metrics_service.record_snapshot(latency_ms=result.latencyMs, throughputFps=result.throughputFps)
        log_service.add_log(
            "PERF", "PERF",
            f"Benchmark finished: {result.workload} on {result.backend.upper()}: "
            f"Avg={result.latencyMs}ms (Min={result.minLatencyMs}ms, Max={result.maxLatencyMs}ms), "
            f"Throughput={result.throughputFps} FPS"
        )
        return result

benchmark_service = BenchmarkService()
