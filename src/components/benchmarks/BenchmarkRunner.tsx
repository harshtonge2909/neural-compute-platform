import React from 'react';
import { Play, Cpu, Zap, Layers, Activity } from 'lucide-react';
import { WorkloadType, BackendTarget } from '../../types';

interface BenchmarkRunnerProps {
  workload: WorkloadType;
  onSelectWorkload: (w: WorkloadType) => void;
  backend: BackendTarget | 'both';
  onSelectBackend: (b: BackendTarget | 'both') => void;
  onRunBenchmark: () => void;
  isRunning: boolean;
  progressPercent: number;
  currentMessage: string;
}

export const BenchmarkRunner: React.FC<BenchmarkRunnerProps> = ({
  workload,
  onSelectWorkload,
  backend,
  onSelectBackend,
  onRunBenchmark,
  isRunning,
  progressPercent,
  currentMessage,
}) => {
  const workloads: { id: WorkloadType; label: string; desc: string }[] = [
    { id: 'Object Detection', label: 'Object Detection', desc: 'Tiny YOLO (416x416 input, INT8)' },
    { id: 'Matrix Multiplication', label: 'Matrix Multiplication', desc: 'GEMM [1024x1024 x 1024x1024]' },
    { id: 'Convolution', label: 'Spatial Convolution', desc: 'Conv2D [3x3 Kernel, 128 Channels]' },
    { id: 'Tiny LLM', label: 'Tiny LLM Token Generation', desc: 'Quantized Transformer Decoder' },
  ];

  return (
    <div className="tech-card rounded-xl p-5 border border-slate-800 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyan-400" />
          <h3 className="font-bold text-slate-100 text-sm font-mono-tech tracking-wider">
            BENCHMARK SUITE CONFIGURATION
          </h3>
        </div>
        <span className="text-[10px] font-mono-tech text-cyan-400 bg-cyan-950/60 border border-cyan-800/40 px-2 py-0.5 rounded">
          EMPIRICAL PROFILER
        </span>
      </div>

      {/* Workload Selection Grid */}
      <div>
        <label className="text-xs font-mono-tech text-slate-300 block mb-2 font-medium">
          TARGET EVALUATION WORKLOAD
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {workloads.map((item) => (
            <button
              key={item.id}
              onClick={() => onSelectWorkload(item.id)}
              disabled={isRunning}
              className={`p-3 rounded-lg border text-left transition-all font-mono-tech ${
                workload === item.id
                  ? 'bg-cyan-950/70 border-cyan-400 text-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.2)]'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <span className="font-bold text-xs block text-slate-200">
                {item.label}
              </span>
              <span className="text-[10px] text-slate-400 block mt-1">
                {item.desc}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Backend Selection & Run Button */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2">
        {/* Backend selection */}
        <div>
          <label className="text-xs font-mono-tech text-slate-300 block mb-1.5 font-medium">
            EXECUTION BACKEND
          </label>
          <div className="flex items-center gap-2 font-mono-tech text-xs">
            <button
              type="button"
              onClick={() => onSelectBackend('cpu')}
              disabled={isRunning}
              className={`px-3 py-2 rounded-lg border transition-all ${
                backend === 'cpu'
                  ? 'bg-amber-950/70 border-amber-500 text-amber-300 font-bold'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              CPU Only
            </button>
            <button
              type="button"
              onClick={() => onSelectBackend('fpga')}
              disabled={isRunning}
              className={`px-3 py-2 rounded-lg border transition-all ${
                backend === 'fpga'
                  ? 'bg-emerald-950/70 border-emerald-500 text-emerald-300 font-bold'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              FPGA Accelerated
            </button>
            <button
              type="button"
              onClick={() => onSelectBackend('both')}
              disabled={isRunning}
              className={`px-3 py-2 rounded-lg border transition-all ${
                backend === 'both'
                  ? 'bg-cyan-950/70 border-cyan-400 text-cyan-300 font-bold shadow-[0_0_10px_rgba(34,211,238,0.25)]'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              Compare Both (CPU vs FPGA)
            </button>
          </div>
        </div>

        {/* Action Button */}
        <div className="md:w-64">
          <button
            onClick={onRunBenchmark}
            disabled={isRunning}
            className={`w-full py-2.5 px-4 rounded-lg font-mono-tech font-bold text-xs tracking-wider flex items-center justify-center gap-2 transition-all ${
              isRunning
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.4)] border border-cyan-400/50'
            }`}
          >
            {isRunning ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-slate-400 border-t-white rounded-full animate-spin" />
                <span>BENCHMARKING...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                <span>RUN BENCHMARK</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Progress display */}
      {isRunning && (
        <div className="pt-2 border-t border-slate-800/80 space-y-1.5 font-mono-tech text-xs">
          <div className="flex items-center justify-between text-slate-300">
            <span className="text-cyan-400 font-medium">{currentMessage}</span>
            <span>{progressPercent}%</span>
          </div>
          <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
