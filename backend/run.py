"""
Standalone Runner for NCA FastAPI Backend.
Can be executed directly or invoked as a Tauri desktop sidecar.
"""
import sys
import uvicorn
from pathlib import Path

# Add project root to sys.path
ROOT_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT_DIR))

if __name__ == "__main__":
    port = 8000
    host = "127.0.0.1"
    print(f"[NCA Backend] Launching FastAPI on http://{host}:{port}")
    uvicorn.run("backend.app.main:app", host=host, port=port, log_level="info", reload=False)
