"""
Cross-Platform Desktop Application Launcher for Neural Computing Architecture.
Manages backend lifecycle, health check validation, and frontend launch.
"""
import sys
import os
import time
import subprocess
import webbrowser
import urllib.request
import signal

def check_backend_health(url="http://127.0.0.1:8000/api/health", retries=20, delay=0.5):
    for i in range(retries):
        try:
            with urllib.request.urlopen(url, timeout=1.0) as resp:
                if resp.status == 200:
                    return True
        except Exception:
            time.sleep(delay)
    return False

def main():
    print("=================================================================")
    print(" Neural Computing Architecture — Desktop Platform Launcher")
    print("=================================================================")

    # 1. Start Python FastAPI backend
    backend_script = os.path.join(os.path.dirname(__file__), "..", "backend", "run.py")
    backend_script = os.path.abspath(backend_script)
    
    print(f"[Launcher] Starting Python backend from {backend_script}...")
    backend_proc = subprocess.Popen([sys.executable, backend_script])

    try:
        print("[Launcher] Waiting for backend readiness...")
        if not check_backend_health():
            print("[Launcher] ERROR: Backend failed to start on http://127.0.0.1:8000")
            backend_proc.terminate()
            sys.exit(1)
        print("[Launcher] Backend verified healthy and ready.")

        # 2. Check if Vite dev server is running
        vite_url = "http://127.0.0.1:5173"
        vite_ready = False
        try:
            with urllib.request.urlopen(vite_url, timeout=1.0) as resp:
                vite_ready = (resp.status == 200)
        except Exception:
            vite_ready = False

        if not vite_ready:
            print("[Launcher] Starting Vite frontend server...")
            npm_cmd = "npm.cmd" if os.name == "nt" else "npm"
            vite_proc = subprocess.Popen([npm_cmd, "run", "dev"])
            time.sleep(2.0)
        else:
            vite_proc = None

        print(f"[Launcher] Opening Neural Computing Architecture at {vite_url}")
        webbrowser.open(vite_url)

        print("[Launcher] Application running. Press Ctrl+C in this console to shut down.")
        while True:
            time.sleep(1)

    except KeyboardInterrupt:
        print("\n[Launcher] Shutting down application services...")
    finally:
        if backend_proc.poll() is None:
            backend_proc.terminate()
            try:
                backend_proc.wait(timeout=3)
            except Exception:
                backend_proc.kill()
        if 'vite_proc' in locals() and vite_proc and vite_proc.poll() is None:
            vite_proc.terminate()
        print("[Launcher] All services terminated cleanly.")

if __name__ == "__main__":
    main()
