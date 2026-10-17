"""
Benchmark API Routes.
"""
from fastapi import APIRouter, HTTPException
from backend.app.models.schemas import BenchmarkRequest, BenchmarkResponse
from backend.app.services.benchmark_service import benchmark_service

router = APIRouter(prefix="/api/benchmark", tags=["benchmark"])

@router.post("/run", response_model=BenchmarkResponse)
def run_benchmark(req: BenchmarkRequest):
    try:
        return benchmark_service.run_benchmark(req)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
