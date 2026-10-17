import React from 'react';
import { 
  Info, 
  Cpu, 
  Layers, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  GitBranch, 
  Terminal, 
  ShieldCheck, 
  ExternalLink 
} from 'lucide-react';
import { useSystem } from '../context/SystemContext';

export const About: React.FC = () => {
  const { systemStatus } = useSystem();

  return (
    <div className="space-y-6 font-sans">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#D9E2EC]">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-bold text-[#172033] tracking-tight">
              About Project
            </h1>
            <span className="text-xs px-2 py-0.5 rounded bg-blue-50 border border-blue-200 text-blue-700 font-semibold font-mono">
              Final Year Engineering Project 2026
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#526174] mt-1">
            Neural Computing Architecture for High Performance and Energy Efficient AI Computation
          </p>
        </div>

        <div className="text-xs font-mono text-[#526174]">
          Platform Version: <strong className="text-[#172033]">v2.4.0 (Linux Desktop)</strong>
        </div>
      </div>

      {/* Project Overview Card */}
      <div className="bg-white rounded-xl p-6 border border-[#D9E2EC] shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-[#D9E2EC]">
          <Info className="w-4 h-4 text-blue-600" />
          <h2 className="font-semibold text-[#172033] text-sm">Project Overview & Objectives</h2>
        </div>
        <p className="text-xs sm:text-sm text-[#172033] leading-relaxed">
          The <strong>Neural Computing Architecture (NCA)</strong> project develops a miniature, energy-efficient edge AI computing platform combining a 
          <strong> Milk-V Mars RISC-V host</strong> with an <strong>FPGA-based Neural Compute Engine (NCE)</strong>.
          By offloading compute-intensive tensor contractions (convolutions and matrix multiplications) from the RISC-V CPU to a spatial 
          systolic array, the platform achieves orders-of-magnitude higher energy efficiency while operating real embedded AI applications.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="p-3.5 rounded-lg bg-[#F8FAFC] border border-[#D9E2EC] space-y-1">
            <span className="text-[10px] font-mono font-semibold text-blue-700 uppercase block">1. Host Platform</span>
            <h3 className="font-semibold text-xs text-[#172033]">Milk-V Mars RISC-V SBC</h3>
            <p className="text-[11px] text-[#526174]">
              StarFive JH7110 Quad-Core RV64GC (1.5 GHz), 8GB LPDDR4 running 64-bit Linux.
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-[#F8FAFC] border border-[#D9E2EC] space-y-1">
            <span className="text-[10px] font-mono font-semibold text-emerald-700 uppercase block">2. AI Accelerator</span>
            <h3 className="font-semibold text-xs text-[#172033]">FPGA Neural Compute Engine</h3>
            <p className="text-[11px] text-[#526174]">
              Custom RTL 64×64 Systolic MAC Array with 1024 KB on-chip double-buffered SRAM.
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-[#F8FAFC] border border-[#D9E2EC] space-y-1">
            <span className="text-[10px] font-mono font-semibold text-purple-700 uppercase block">3. Applications</span>
            <h3 className="font-semibold text-xs text-[#172033]">Edge AI Workloads</h3>
            <p className="text-[11px] text-[#526174]">
              Real-time Object Detection (Tiny YOLO / YOLOX) & Local Quantized Language Model (Tiny LLM).
            </p>
          </div>
        </div>
      </div>

      {/* Hardware & Software Implementation Status Matrix */}
      <div className="bg-white rounded-xl p-6 border border-[#D9E2EC] shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-[#D9E2EC]">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-600" />
            <h2 className="font-semibold text-[#172033] text-sm">
              Engineering Status Matrix: Implemented vs Hardware-Dependent
            </h2>
          </div>
          <span className="text-[11px] text-[#718096] font-mono">
            Audited October 2026
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Fully Implemented & Verified */}
          <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/30 space-y-3">
            <div className="flex items-center gap-2 text-emerald-800 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Implemented & Fully Verified Features</span>
            </div>
            <ul className="space-y-2 text-[#172033] text-[11px]">
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span><strong>Linux Desktop Application Architecture:</strong> Tauri 2 + React 19 + TypeScript + Tailwind CSS production bundle.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span><strong>Python FastAPI Edge Backend:</strong> Full REST API, WebSocket event streaming, and persistent JSON settings.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span><strong>Genuine CPU Object Detection:</strong> Real ONNX Runtime engine running lightweight YOLOX-Nano / YOLOv5n with authentic bounding boxes.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span><strong>Local Tiny LLM Inference:</strong> Autoregressive streaming token generation, configurable parameters, and stop handling.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span><strong>Hardware Abstraction Layer (HAL):</strong> Clean separation between CPU host and FPGA accelerator drivers.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span><strong>Real Benchmarking Module:</strong> Timed repeated runs for matrix multiplication, convolution, and detection with memory & CPU telemetry.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span><strong>Honest Status Reporting:</strong> Disconnected hardware state clearly identified without fabricating power or speedup figures.</span>
              </li>
            </ul>
          </div>

          {/* Hardware-Dependent / In-Progress */}
          <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/30 space-y-3">
            <div className="flex items-center gap-2 text-amber-900 font-semibold">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              <span>Hardware-Dependent & Integration Steps</span>
            </div>
            <ul className="space-y-2 text-[#172033] text-[11px]">
              <li className="flex items-start gap-2">
                <span className="text-amber-600 font-bold">•</span>
                <span><strong>Physical SPI / Character Driver:</strong> Requires flashing FPGA bitstream onto hardware daughterboard and loading <code>/dev/nce0</code> Linux driver.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-600 font-bold">•</span>
                <span><strong>Real FPGA Power Measurement:</strong> Requires physical INA219 / INA226 I2C current sensor connection to measure true board milliwatts.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-600 font-bold">•</span>
                <span><strong>GGUF Llama.cpp Kernel:</strong> Ready to hook into <code>llama-cli</code> binary on Milk-V Mars board once small GGUF weights are copied.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-600 font-bold">•</span>
                <span><strong>Systolic Array Speedup Verification:</strong> Will be measured against CPU baseline once physical FPGA hardware handshake passes loopback.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Technology Stack Details */}
      <div className="bg-white rounded-xl p-6 border border-[#D9E2EC] shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-[#D9E2EC]">
          <Terminal className="w-4 h-4 text-blue-600" />
          <h2 className="font-semibold text-[#172033] text-sm">Technology Stack & Libraries</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-lg bg-[#F8FAFC] border border-[#D9E2EC]">
            <span className="text-[10px] text-[#718096] uppercase font-mono block mb-1">Frontend Framework</span>
            <strong className="text-[#172033] block">React 19 + TypeScript</strong>
            <span className="text-[10px] text-[#526174]">Vite 8, Tailwind CSS v4</span>
          </div>

          <div className="p-3 rounded-lg bg-[#F8FAFC] border border-[#D9E2EC]">
            <span className="text-[10px] text-[#718096] uppercase font-mono block mb-1">Desktop Shell</span>
            <strong className="text-[#172033] block">Tauri v2</strong>
            <span className="text-[10px] text-[#526174]">Linux AppImage & Debian</span>
          </div>

          <div className="p-3 rounded-lg bg-[#F8FAFC] border border-[#D9E2EC]">
            <span className="text-[10px] text-[#718096] uppercase font-mono block mb-1">Backend Runtime</span>
            <strong className="text-[#172033] block">Python FastAPI</strong>
            <span className="text-[10px] text-[#526174]">Uvicorn, WebSockets, psutil</span>
          </div>

          <div className="p-3 rounded-lg bg-[#F8FAFC] border border-[#D9E2EC]">
            <span className="text-[10px] text-[#718096] uppercase font-mono block mb-1">Inference Engine</span>
            <strong className="text-[#172033] block">ONNX Runtime</strong>
            <span className="text-[10px] text-[#526174]">YOLOX-Nano, YOLOv5n INT8/FP16</span>
          </div>
        </div>
      </div>
    </div>
  );
};
