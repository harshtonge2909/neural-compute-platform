"""
WebSocket Real-Time Event Bus.
Streams system status, telemetry snapshots, and logs to connected frontend clients.
"""
import asyncio
import json
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from backend.app.services.log_service import log_service
from backend.app.services.metrics_service import metrics_service
from backend.app.models.schemas import LogEntry

router = APIRouter(prefix="/api/ws", tags=["websocket"])

class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def broadcast(self, message: dict):
        dead_conns = []
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except Exception:
                dead_conns.append(connection)
        for dc in dead_conns:
            self.disconnect(dc)

ws_manager = ConnectionManager()

def on_new_log(entry: LogEntry):
    # Schedule broadcast on running loop if available
    try:
        loop = asyncio.get_event_loop()
        if loop.is_running():
            asyncio.run_coroutine_threadsafe(
                ws_manager.broadcast({"type": "log", "data": entry.model_dump()}),
                loop
            )
    except Exception:
        pass

log_service.subscribe(on_new_log)

@router.websocket("/events")
async def websocket_events(websocket: WebSocket):
    await ws_manager.connect(websocket)
    try:
        # Initial handshake: send current status & initial logs
        initial_status = metrics_service.get_system_status().model_dump()
        await websocket.send_json({"type": "status", "data": initial_status})

        while True:
            # Heartbeat / telemetry push every 1.5 seconds
            await asyncio.sleep(1.5)
            status = metrics_service.get_system_status().model_dump()
            await websocket.send_json({"type": "telemetry", "data": status})
    except WebSocketDisconnect:
        ws_manager.disconnect(websocket)
    except Exception:
        ws_manager.disconnect(websocket)
