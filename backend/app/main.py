"""
Main FastAPI Application Entrypoint for Neural Computing Architecture (NCA).
"""
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.app.services.device_manager import device_manager
from backend.app.services.log_service import log_service
from backend.app.routes import (
    health, system, devices, models, detection, llm, benchmark, settings, websocket
)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup sequence
    log_service.add_log("RUNTIME", "INFO", "NCA Hardware daemon starting up...")
    device_manager.cpu_engine.initialize()
    device_manager.fpga_engine.initialize()
    log_service.add_log("RUNTIME", "INFO", "FastAPI edge server listening on http://127.0.0.1:8000")
    yield
    # Shutdown sequence
    log_service.add_log("RUNTIME", "INFO", "NCA Hardware daemon shutting down safely")
    device_manager.cpu_engine.shutdown()
    device_manager.fpga_engine.shutdown()

app = FastAPI(
    title="Neural Computing Architecture (NCA) Platform API",
    description="Unified edge AI runtime and hardware control API for Milk-V Mars RISC-V and FPGA NCE.",
    version="2.4.0",
    lifespan=lifespan
)

# Enable CORS for local desktop UI and dev servers
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(health.router)
app.include_router(system.router)
app.include_router(devices.router)
app.include_router(models.router)
app.include_router(detection.router)
app.include_router(llm.router)
app.include_router(benchmark.router)
app.include_router(settings.router)
app.include_router(websocket.router)
