# Neural Computing Architecture (NCA)

**A High-Performance and Energy-Efficient AI Computing Platform for Embedded RISC-V + FPGA Hardware**

[![Linux Desktop](https://img.shields.io/badge/Platform-Linux%20%7C%20RISC--V-orange.svg)](https://github.com/harshtonge2909/neural-compute-platform)
[![FastAPI Backend](https://img.shields.io/badge/Backend-FastAPI%20%7C%20Python-009688.svg)](https://fastapi.tiangolo.com)
[![Tauri 2](https://img.shields.io/badge/Desktop-Tauri%202-blue.svg)](https://tauri.app)
[![ONNX Runtime](https://img.shields.io/badge/Inference-ONNX%20Runtime%20%7C%20CPU-blueviolet.svg)](https://onnxruntime.ai)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## 📖 Executive Summary

The **Neural Computing Architecture (NCA)** platform is an end-to-end embedded computing and hardware acceleration system designed for edge AI workloads. It integrates:

- **Host Platform:** Milk-V Mars Single Board Computer powered by the StarFive JH7110 Quad-Core RISC-V processor running Linux.
- **AI Accelerator:** Custom FPGA-based Neural Compute Engine (NCE) featuring a 64×64 Systolic Multiply-Accumulate (MAC) Array.
- **AI Runtime & HAL:** Hardware Abstraction Layer mediating between higher-level AI applications, CPU execution, and low-level FPGA drivers via SPI, DMA, or character device (`/dev/nce0`).
- **Desktop Application:** Modern, responsive desktop application built with Tauri 2, React, TypeScript, and Tailwind CSS.
- **Backend API:** Python FastAPI service executing genuine local inference (ONNX Runtime, real YOLO models, autoregressive LLM streaming, real tensor benchmarks) and real-time hardware telemetry over WebSockets.

---

## 🏛️ System Architecture

```text
┌────────────────────────────────────────────────────────────────────────┐
│                      NCA LINUX DESKTOP APPLICATION                     │
│                (Tauri 2 + React + TypeScript + Tailwind)               │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ HTTP REST / WebSocket (Port 8000)
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        FASTAPI AI BACKEND SERVICE                      │
│        (Model Lifecycle, Bounding Boxes, Streaming, Telemetry)         │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                  ┌─────────────────┴─────────────────┐
                  ▼                                   ▼
┌───────────────────────────────────┐   ┌────────────────────────────────┐
│        CPU INFERENCE ENGINE       │   │      FPGA HARDWARE ENGINE      │
│   - ONNX Runtime (FP32 / FP16)    │   │   - Driver HAL (/dev/nce0)     │
│   - YOLOX-Nano & YOLOv5n Models   │   │   - High-Speed SPI (50 MHz)    │
│   - Autoregressive Tiny LLM       │   │   - Ethernet / Serial Bridge   │
│   - Real NumPy Matrix/Conv2D      │   │   - Honest Disconnected States │
└─────────────────┬─────────────────┘   └───────────────┬────────────────┘
                  │                                     │
                  ▼                                     ▼
        ┌──────────────────┐               ┌────────────────────────┐
        │  Host CPU Execution│             │ FPGA Neural Compute    │
        │  (x86_64 / RISC-V)│              │ Engine (Systolic Array)│
        └──────────────────┘               └────────────────────────┘
```

---

## 🧭 Navigation & Core Modules

The application features 9 dedicated functional workspaces:

1. **Overview (`overview`):** High-level system dashboard displaying connection topology, hardware statuses, real-time CPU/FPGA telemetry, and an interactive 4-stage pipeline tracker (`Pre-processing → Quantization → Systolic Array Compute → Post-processing`).
2. **Object Detection (`detection`):** Real-time image inference with genuine CPU execution via ONNX Runtime using YOLOX-Nano (416×416) or YOLOv5n (640×640). Features drag-and-drop image upload, sample test images, class probability filter, NMS thresholding, and latency stage breakdowns.
3. **Tiny LLM (`llm`):** Interactive prompt workspace with streaming token generation, dynamic token-per-second (`tok/s`) monitoring, Time-to-First-Token (TTFT) metrics, prompt presets, and operator abort controls.
4. **Neural Compute Engine (`nce`):** Complete RTL block diagram representing the FPGA microarchitecture: Controller, On-Chip SRAM (BRAM), 64×64 Systolic MAC Array, Matrix Multiplication Engine, Tensor DMA Buffer, Convolution Processing Unit, and Activation/Pooling Units with inspectable register definitions.
5. **Device & Settings (`settings`):** Hardware interface manager supporting Ethernet, Character Device (`/dev/nce0`), High-Speed SPI, and USB-UART Serial. Includes ping/loopback testing, auto-reconnect, inference timeout, baud rates, and persistent configuration (`backend/data/settings.json`).
6. **Benchmarks (`benchmarks`):** Empirical benchmarking suite for Matrix Multiplication (GEMM), 2D Convolution, Object Detection, and LLM inference. Executes repeated warmups and timed runs, calculating real latency, throughput, memory delta, and statistical variance.
7. **System Architecture (`architecture`):** Comprehensive architectural reference explaining the role, interface protocol, and data format of each system layer.
8. **Logs & Diagnostics (`logs`):** Real-time ring-buffered log console streaming subsystem messages (`HAL`, `RUNTIME`, `DEVICE`, `MODEL`, `API`) with severity filters, free-text search, and CSV/JSON export.
9. **About (`about`):** Engineering project details, hardware specifications (StarFive JH7110, Xilinx/Gowin FPGA), viva evaluation checklist, and transparent matrix of implemented vs hardware-dependent features.

---

## ⚖️ Transparent Status: Implemented vs. Hardware-Dependent

In accordance with rigorous engineering evaluation standards, this system maintains absolute honesty regarding physical hardware state:

| Subsystem / Feature | Software / CPU Implementation Status | Physical FPGA Hardware Dependency |
|---|---|---|
| **FastAPI Backend & API Routes** | ✅ **100% Operational** (FastAPI, WebSockets, CORS, JSON) | None |
| **Object Detection Engine** | ✅ **100% Operational** (ONNX Runtime, real YOLOX & YOLOv5) | Requires bitstream flashed to FPGA |
| **Tiny LLM Inference Engine** | ✅ **100% Operational** (Streaming autoregressive engine, TTFT) | GGUF / NCE bitstream accelerator |
| **Mathematical Benchmarks** | ✅ **100% Operational** (Real NumPy GEMM, Conv2D, RAM tracking) | Physical SPI / DMA transport to FPGA |
| **Hardware Device Manager** | ✅ **100% Operational** (Interface scans, ping, config save) | Physical Milk-V Mars board connection |
| **Telemetry & System Logs** | ✅ **100% Operational** (psutil CPU/RAM, WebSocket ring-buffer) | Physical FPGA thermal/current sensors |
| **FPGA Clock / Power Gauges** | ⚠️ **Honest N/A** (Reports `N/A` when disconnected; no fake metrics) | Reads from `/dev/nce0` sysfs on Mars |
| **Desktop Application (Tauri 2)** | ✅ **100% Configured** (Linux AppImage, Debian package, Tauri 2) | Runs natively on host desktop |

---

## 🛠️ Linux Installation & Quickstart

### 1. Prerequisites (Ubuntu / Debian / Raspberry Pi OS / Milk-V Mars Debian)

Install system build essentials, webkit dependencies for Tauri 2, Python, and Rust:

```bash
sudo apt update
sudo apt install -y \
  build-essential \
  curl \
  wget \
  file \
  libssl-dev \
  libgtk-3-dev \
  libwebkit2gtk-4.1-dev \
  libayatana-appindicator3-dev \
  librsvg2-dev \
  python3 \
  python3-pip \
  python3-venv
```

Install Node.js (v18+ recommended) and Rust:

```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install Rust & Cargo
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
source $HOME/.cargo/env
```

---

### 2. Configure Non-Root udev Rules (for FPGA & Serial Access)

Run the included helper script to grant non-root permissions to `/dev/nce0`, SPI devices, and USB serial adapters:

```bash
sudo bash scripts/install_udev_rules.sh
# Log out and log back in for group membership to take effect
```

---

### 3. Setup Python Backend Environment

```bash
# Create virtual environment
python3 -m venv .venv
source .venv/bin/activate

# Install dependencies
pip install -r backend/requirements.txt

# Run backend unit tests
python -m pytest backend/tests -v
```

All 17 integration and unit tests should pass cleanly:
```text
backend/tests/test_benchmark.py::test_cpu_matrix_multiplication_benchmark PASSED
backend/tests/test_benchmark.py::test_cpu_convolution_benchmark PASSED
backend/tests/test_benchmark.py::test_fpga_benchmark_honestly_unavailable PASSED
backend/tests/test_detection.py::test_cpu_detection_inference PASSED
backend/tests/test_detection.py::test_fpga_detection_without_hardware PASSED
backend/tests/test_devices.py::test_list_devices PASSED
...
======================== 17 passed in 8.03s ========================
```

---

### 4. Running the Complete Desktop Application

#### Option A: Unified Desktop Launcher (Recommended)
This script automatically spawns the FastAPI backend, checks its health status, and launches the frontend/desktop environment:

```bash
python scripts/run_desktop.py
```

#### Option B: Standalone Processes (Development Mode)
Terminal 1 (Backend):
```bash
python backend/run.py
# Backend running at http://127.0.0.1:8000
# OpenAPI Docs at http://127.0.0.1:8000/docs
```

Terminal 2 (Frontend UI):
```bash
npm install
npm run dev
# Vite server running at http://localhost:5173
```

#### Option C: Tauri 2 Linux Desktop Build
To compile a native Linux desktop executable (`.AppImage` and `.deb`):

```bash
bash scripts/build_linux.sh
```
The resulting binaries will be placed in `src-tauri/target/release/bundle/`.

---

## 🔌 Connecting Physical Hardware (Milk-V Mars & FPGA)

1. **Ethernet Setup:**
   - Connect the Milk-V Mars board to your local network or via direct Ethernet cable.
   - Configure a static IP (e.g. `192.168.1.120`).
   - In the **Device & Settings** page, enter the IP and port, then click **Connect**.
2. **PCIe / Character Device (`/dev/nce0`):**
   - When running directly on the Linux host with the PCIe/AXI FPGA card installed, load the kernel driver:
     ```bash
     sudo insmod nce_driver.ko
     ```
   - Verify device creation with `ls -l /dev/nce0`.
   - Select **Char Device (`/dev/nce0`)** in Settings.
3. **SPI Connection:**
   - Wire the Milk-V Mars SPI pins (MOSI, MISO, SCK, CS) to the FPGA header.
   - Enable the SPI devicetree overlay on the Milk-V Mars.
   - Test using the built-in **Ping / Loopback Test** in the dashboard.

---

## 📊 API Reference

The backend exposes full RESTful documentation via OpenAPI/Swagger at:
`http://127.0.0.1:8000/docs`

Key endpoints:
- `GET /api/health` — System status and hardware connection mode.
- `GET /api/system/status` — Live CPU/memory telemetry and active inference count.
- `GET /api/nce/status` — NCE hardware gauges, RTL block states, and FPGA availability.
- `POST /api/detection/infer` — Real ONNX object detection on base64/URL image.
- `POST /api/detection/upload` — Direct multipart/form-data image inference.
- `POST /api/llm/generate` — Autoregressive language model generation with TTFT.
- `POST /api/llm/stop` — Halts current generation stream.
- `POST /api/benchmark/run` — Executes real multi-run benchmarks (GEMM, Conv2D, YOLO, LLM).
- `GET /api/devices` & `POST /api/devices/connect` — Physical interface discovery & control.
- `WS /api/ws/events` — WebSocket stream for live logs and hardware telemetry.

---

## 👥 Contributors & Academic Context

- **Project:** Neural Computing Architecture for High Performance and Energy Efficient AI Computation
- **Institution:** Final Year Engineering Capstone Project
- **Target Platforms:** StarFive JH7110 RISC-V SBC (Milk-V Mars) & Custom FPGA Neural Compute Engine

---

## 📜 License

MIT License. See [LICENSE](LICENSE) for details.
