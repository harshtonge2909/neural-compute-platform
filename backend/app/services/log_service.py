"""
Logging Service for NCA Platform.
Maintains in-memory ring buffer with WebSocket broadcast capabilities.
"""
import time
from typing import List, Callable, Optional
from collections import deque
from backend.app.models.schemas import LogEntry

class LogService:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(LogService, cls).__new__(cls)
            cls._instance.logs = deque(maxlen=500)
            cls._instance.subscribers = []
            cls._instance._init_default_logs()
        return cls._instance

    def _init_default_logs(self):
        self.add_log("RUNTIME", "INFO", "NCA Linux Runtime initialized (FastAPI v0.141 on Python 3.12)")
        self.add_log("HOST", "INFO", "CPU inference backend registered with ONNX Runtime")
        self.add_log("COMM", "WARN", "FPGA hardware not detected on local bus (/dev/nce0)")

    def add_log(self, module: str, level: str, message: str) -> LogEntry:
        entry = LogEntry(
            id=f"log-{time.time_ns()}",
            timestamp=time.strftime("%H:%M:%S"),
            level=level,
            module=module,
            message=message
        )
        self.logs.appendleft(entry)
        
        # Notify subscribers
        for sub in list(self.subscribers):
            try:
                sub(entry)
            except Exception:
                pass
        return entry

    def get_logs(self, limit: int = 100, level: Optional[str] = None, module: Optional[str] = None) -> List[LogEntry]:
        results = list(self.logs)
        if level:
            results = [e for e in results if e.level.upper() == level.upper()]
        if module:
            results = [e for e in results if e.module.upper() == module.upper()]
        return results[:limit]

    def clear_logs(self):
        self.logs.clear()
        self.add_log("RUNTIME", "INFO", "System logs cleared by user")

    def subscribe(self, callback: Callable[[LogEntry], None]):
        self.subscribers.append(callback)

    def unsubscribe(self, callback: Callable[[LogEntry], None]):
        if callback in self.subscribers:
            self.subscribers.remove(callback)

log_service = LogService()
