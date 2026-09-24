# Neural Computing Architecture (NCA) Platform

**High-Performance and Energy-Efficient AI Computation on Embedded RISC-V + FPGA Hardware**

---

## 🚀 Overview

The **NCA Dashboard** is a technical control panel and visualization console engineered for a miniature AI edge computing platform consisting of:

- **Host Platform:** Milk-V Mars Single Board Computer
- **Processor:** StarFive JH7110 Quad-Core RISC-V (RV64GC @ 1.5 GHz) running Linux
- **AI Accelerator:** FPGA-based custom Neural Compute Engine (NCE v2.4) with a 64×64 Systolic Multiply-Accumulate (MAC) Array
- **AI Runtime:** Model quantization (INT8), graph parsing, memory allocation, and kernel scheduling
- **Communication Layer:** Hardware-agnostic SPI / DMA transport abstraction
- **AI Applications:**
  1. **Object Detection:** Tiny YOLO / YOLOv8-Nano with real-time bounding box visualization
  2. **Tiny LLM:** Quantized Transformer inference console with token streaming telemetry

---

## 🛠️ System Architecture

```text
               ┌──────────────────────────────┐
               │        AI APPLICATION        │
               │  Object Detection / Tiny LLM │
               └──────────────┬───────────────┘
                              ↓
               ┌──────────────────────────────┐
               │         AI REST API          │
               │   HTTP / WebSocket Server    │
               └──────────────┬───────────────┘
                              ↓
               ┌──────────────────────────────┐
               │          AI RUNTIME          │
               │  Model / Tensor Management   │
               └──────────────┬───────────────┘
                              ↓
               ┌──────────────────────────────┐
               │     COMMUNICATION LAYER      │
               │    SPI / DMA Bus Driver      │
               └──────────────┬───────────────┘
                              ↓
               ┌──────────────────────────────┐
               │       MILK-V MARS SBC        │
               │  StarFive JH7110 RISC-V Linux│
               └──────────────┬───────────────┘
                              │
                    50 MHz SPI / DMA
                              │
                              ↓
               ┌──────────────────────────────┐
               │   FPGA NEURAL COMPUTE ENGINE │
               │  64x64 Systolic MAC Array    │
               │  1024 KB On-Chip SRAM (BRAM) │
               │  GEMM Matrix Engine & Conv2D │
               └──────────────────────────────┘
```

> **Architectural Separation Principle:** The frontend represents the AI Application / Visualization Layer and connects strictly via the REST API (`/services/api.ts`). It does not bypass the runtime or directly access hardware registers.

---

## 💻 Tech Stack

- **Framework:** React 19 + TypeScript
- **Bundler:** Vite
- **Styling:** Tailwind CSS (Dark Technical Theme)
- **Icons:** Lucide React
- **Charting & Graphs:** Recharts
- **Design Language:** Embedded FPGA accelerator console with monospace metrics, subtle glows, and live telemetry.

---

## 📂 Navigation Pages

1. **Overview:** Executive system status, dynamic accelerator pipeline visualization, real-time latency / FPS / load charts, and mini telemetry cards.
2. **Object Detection:** Image upload, drag-and-drop, 3 offline sample feeds (pedestrians, vehicles, wildlife), camera option, bounding boxes, latency stage breakdown, and CPU vs FPGA comparison chart.
3. **Tiny LLM:** Quantized Transformer inference console with preset engineering prompts, simulated token streaming, pipeline stage tracker (`Tokenization → Tensor Prep → FPGA Exec → Streaming`), and tok/s metrics.
4. **Neural Compute Engine:** Hardware RTL block diagram (Controller, On-Chip Memory, MAC Array, Matrix Engine, Tensor Buffer, Conv Unit, Activation Unit, Pooling Unit) with active state animations and physical gauges (temperature, power, clock, utilization).
5. **Benchmarks:** Empirical evaluation comparing CPU-only baseline vs FPGA-accelerated execution across 4 workloads (Object Detection, Matrix Multiplication, Convolution, Tiny LLM) with 4 comparative charts, speedup table, and CSV export.
6. **System Architecture:** Interactive layered stack explorer explaining the purpose, interfaces, data formats, and responsibilities of each layer.

---

## ⚡ Modes

- **Simulation Mode (`SIMULATION`):** Active by default for demonstrations without physical hardware. Uses client-side deterministic models with realistic jitter, stage delays, and bounding box coordinates.
- **Hardware Connected (`HARDWARE`):** Connects to the real Milk-V Mars REST API (`http://192.168.1.120:8080`) through the abstracted `RealAIBackend` class in `src/services/api.ts`.
- **Demo Mode (`Demo: ON`):** Generates subtle telemetry fluctuations, hardware block animations, and runtime logs suitable for project demonstrations.

---

## 🛠️ Running Locally

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Production build
npm run build
```
