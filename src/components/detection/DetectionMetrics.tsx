import React from 'react';
import { 
  Clock, 
  Activity, 
  Cpu, 
  Zap, 
  BatteryCharging, 
  Layers 
} from 'lucide-react';
import { DetectionResult } from '../../types';

interface DetectionMetricsProps {
  result: DetectionResult | null;
  isLoading: boolean;
}

export const DetectionMetrics: React.FC<DetectionMetricsProps> = ({ result, isLoading }) => {
  if (!result && !isLoading) {
    return (
      <div className="tech-card rounded-xl p-5 border border-slate-800 text-center text-slate-400 font-mono-tech text-xs py-8">
        Run inference to evaluate hardware latency, throughput, and energy metrics.
      </div>
    );
  }

  const isFpga = result?.backendUsed === 'fpga';

  return (
    <div className="tech-card rounded-xl p-5 border border-slate-800 space-y-4">
      {/* Title */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyan-400" />
          <h3 className="font-bold text-slate-100 text-sm font-mono-tech tracking-wider">
            INFERENCE PERFORMANCE TELEMETRY
          </h3>
        </div>
        <div className="flex items-center gap-2 font-mono-tech text-xs">
          <span
            className={`px-2 py-0.5 rounded border text-[10px] font-bold uppercase ${
              isFpga
                ? 'bg-emerald-950/70 border-emerald-500/60 text-emerald-300'
                : 'bg-amber-950/70 border-amber-500/60 text-amber-300'
            }`}
          >
            {isFpga ? 'FPGA ACCELERATED' : 'CPU BASELINE'}
          </span>
          {result?.isSimulated && (
            <span className="text-[10px] text-amber-400 bg-amber-950/40 px-1.5 py-0.5 rounded border border-amber-800/40">
              SIMULATED
            </span>
          )}
        </div>
      </div>

      {/* Latency Stage Breakdown */}
      <div className="p-3.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
        <div className="flex items-center justify-between mb-2 font-mono-tech text-xs">
          <span className="text-slate-300 font-semibold">Total Inference Latency</span>
          <span className="text-cyan-400 font-bold text-base">
            {result ? `${result.inferenceTimeMs} ms` : '--'}
          </span>
        </div>

        {/* Progress bar showing latency stage split */}
        {result && (
          <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden flex border border-slate-800 font-mono-tech">
            <div
              style={{
                width: `${(result.preProcessingMs / result.inferenceTimeMs) * 100}%`,
              }}
              className="bg-sky-500 h-full"
              title={`Pre-processing: ${result.preProcessingMs} ms`}
            />
            <div
              style={{
                width: `${( (isFpga ? result.nceExecutionMs : result.inferenceTimeMs - result.preProcessingMs - result.postProcessingMs) / result.inferenceTimeMs) * 100}%`,
              }}
              className={isFpga ? 'bg-emerald-500 h-full' : 'bg-amber-500 h-full'}
              title={`Compute Kernel: ${isFpga ? result.nceExecutionMs : 'CPU Exec'} ms`}
            />
            <div
              style={{
                width: `${(result.postProcessingMs / result.inferenceTimeMs) * 100}%`,
              }}
              className="bg-purple-500 h-full"
              title={`Post-processing: ${result.postProcessingMs} ms`}
            />
          </div>
        )}

        <div className="grid grid-cols-3 gap-2 mt-3 pt-2 border-t border-slate-800/60 font-mono-tech text-[11px]">
          <div>
            <span className="text-slate-400 block text-[10px]">Pre-processing</span>
            <span className="text-sky-300 font-semibold">
              {result ? `${result.preProcessingMs} ms` : '--'}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">
              {isFpga ? 'NCE Execution' : 'CPU Execution'}
            </span>
            <span className={isFpga ? 'text-emerald-300 font-semibold' : 'text-amber-300 font-semibold'}>
              {result ? (isFpga ? `${result.nceExecutionMs} ms` : `${(result.inferenceTimeMs - result.preProcessingMs - result.postProcessingMs).toFixed(1)} ms`) : '--'}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">Post-processing</span>
            <span className="text-purple-300 font-semibold">
              {result ? `${result.postProcessingMs} ms` : '--'}
            </span>
          </div>
        </div>
      </div>

      {/* Grid of Secondary Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono-tech">
        {/* Throughput */}
        <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
          <span className="text-[10px] text-slate-400 block uppercase">Throughput</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-xl font-bold text-slate-100">
              {result ? result.fps : '--'}
            </span>
            <span className="text-[11px] text-slate-400">FPS</span>
          </div>
          <span className="text-[10px] text-emerald-400 mt-0.5 block">
            {isFpga ? '7.7x vs CPU' : 'Baseline'}
          </span>
        </div>

        {/* CPU Utilization */}
        <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
          <span className="text-[10px] text-slate-400 block uppercase">CPU Load</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-xl font-bold text-slate-100">
              {result ? `${result.cpuUtilization}%` : '--'}
            </span>
          </div>
          <span className="text-[10px] text-slate-400 mt-0.5 block">
            {isFpga ? 'Host Free' : 'Near 100% Saturation'}
          </span>
        </div>

        {/* FPGA Utilization */}
        <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
          <span className="text-[10px] text-slate-400 block uppercase">FPGA Load</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-xl font-bold text-emerald-400">
              {result ? `${result.fpgaUtilization}%` : '--'}
            </span>
          </div>
          <span className="text-[10px] text-slate-400 mt-0.5 block">
            {isFpga ? 'Active Systolic' : '0% (Idle)'}
          </span>
        </div>

        {/* Energy / Inference */}
        <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
          <span className="text-[10px] text-slate-400 block uppercase">Energy / Frame</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-xl font-bold text-cyan-300">
              {result ? `${result.energyJoules} J` : '--'}
            </span>
          </div>
          <span className="text-[10px] text-emerald-400 mt-0.5 block">
            {isFpga ? '85.8% Less Energy' : 'High Dissipation'}
          </span>
        </div>
      </div>
    </div>
  );
};
