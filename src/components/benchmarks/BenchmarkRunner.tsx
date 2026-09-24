import React from 'react';
import { Play, Activity } from 'lucide-react';
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
    { id: 'Object Detection', label: 'Object Detection', desc: 'Tiny YOLO (416×416 input, INT8)' },
    { id: 'Matrix Multiplication', label: 'Matrix Multiplication', desc: 'GEMM [1024×1024 × 1024×1024]' },
    { id: 'Convolution', label: 'Spatial Convolution', desc: 'Conv2D [3×3 Kernel, 128 Channels]' },
    { id: 'Tiny LLM', label: 'Tiny LLM Token Generation', desc: 'Quantized Transformer Decoder' },
  ];

  return (
    <div className="bg-white rounded-xl p-5 border border-[#D9E2EC] shadow-xs space-y-4 font-sans">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-blue-600" />
          <h3 className="font-bold text-[#172033] text-sm tracking-tight">
            Benchmark Suite Configuration
          </h3>
        </div>
        <span className="text-[11px] font-sans font-medium text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
          Empirical Profiler
        </span>
      </div>

      {/* Workload Selection Grid */}
      <div>
        <label className="text-xs font-semibold text-[#172033] block mb-2">
          Target Evaluation Workload
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {workloads.map((item) => (
            <button
              key={item.id}
              onClick={() => onSelectWorkload(item.id)}
              disabled={isRunning}
              className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                workload === item.id
                  ? 'bg-blue-50 border-blue-400 text-blue-900 shadow-2xs'
                  : 'bg-[#F8FAFC] border-[#D9E2EC] text-[#526174] hover:bg-white hover:border-slate-300'
              }`}
            >
              <span className="font-bold text-xs block text-[#172033]">
                {item.label}
              </span>
              <span className="text-[11px] text-[#718096] block mt-1">
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
          <label className="text-xs font-semibold text-[#172033] block mb-1.5">
            Execution Backend
          </label>
          <div className="flex items-center gap-2 text-xs">
            <button
              type="button"
              onClick={() => onSelectBackend('cpu')}
              disabled={isRunning}
              className={`px-3 py-2 rounded-lg border transition-all cursor-pointer ${
                backend === 'cpu'
                  ? 'bg-slate-200 border-slate-400 text-[#172033] font-semibold'
                  : 'bg-white border-[#D9E2EC] text-[#526174] hover:bg-slate-50'
              }`}
            >
              CPU Only
            </button>
            <button
              type="button"
              onClick={() => onSelectBackend('fpga')}
              disabled={isRunning}
              className={`px-3 py-2 rounded-lg border transition-all cursor-pointer ${
                backend === 'fpga'
                  ? 'bg-blue-50 border-blue-400 text-blue-900 font-semibold'
                  : 'bg-white border-[#D9E2EC] text-[#526174] hover:bg-slate-50'
              }`}
            >
              FPGA Accelerated
            </button>
            <button
              type="button"
              onClick={() => onSelectBackend('both')}
              disabled={isRunning}
              className={`px-3 py-2 rounded-lg border transition-all cursor-pointer ${
                backend === 'both'
                  ? 'bg-blue-600 border-blue-600 text-white font-semibold shadow-xs'
                  : 'bg-white border-[#D9E2EC] text-[#526174] hover:bg-slate-50'
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
            className={`w-full py-2.5 px-4 rounded-lg font-sans font-semibold text-xs tracking-wide flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs ${
              isRunning
                ? 'bg-slate-200 text-slate-500 cursor-not-allowed border border-slate-300'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {isRunning ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-slate-400 border-t-blue-600 rounded-full animate-spin" />
                <span>Benchmarking...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Run Benchmark</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Progress display */}
      {isRunning && (
        <div className="pt-2 border-t border-slate-100 space-y-1.5 text-xs">
          <div className="flex items-center justify-between text-[#172033]">
            <span className="text-blue-700 font-medium">{currentMessage}</span>
            <span className="font-mono-tech">{progressPercent}%</span>
          </div>
          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
