import React from 'react';
import { Activity } from 'lucide-react';
import { DetectionResult } from '../../types';

interface DetectionMetricsProps {
  result: DetectionResult | null;
  isLoading: boolean;
}

export const DetectionMetrics: React.FC<DetectionMetricsProps> = ({ result, isLoading }) => {
  if (!result && !isLoading) {
    return (
      <div className="bg-white rounded-xl p-5 border border-[#D9E2EC] shadow-xs text-center text-[#718096] font-sans text-xs py-8">
        Run inference to evaluate hardware latency, throughput, and energy metrics.
      </div>
    );
  }

  const isFpga = result?.backendUsed === 'fpga';

  return (
    <div className="bg-white rounded-xl p-5 border border-[#D9E2EC] shadow-xs space-y-4 font-sans">
      {/* Title */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-blue-600" />
          <h3 className="font-bold text-[#172033] text-sm tracking-tight">
            Inference Performance Telemetry
          </h3>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span
            className={`px-2 py-0.5 rounded border text-[11px] font-semibold uppercase ${
              isFpga
                ? 'bg-blue-50 border-blue-200 text-blue-800'
                : 'bg-slate-100 border-slate-200 text-slate-700'
            }`}
          >
            {isFpga ? 'FPGA Accelerated' : 'CPU Baseline'}
          </span>
          {result?.isSimulated && (
            <span className="text-[10px] text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
              Simulated
            </span>
          )}
        </div>
      </div>

      {/* Latency Stage Breakdown */}
      <div className="p-3.5 rounded-lg bg-[#F8FAFC] border border-[#D9E2EC]">
        <div className="flex items-center justify-between mb-2 text-xs">
          <span className="text-[#172033] font-semibold">Total Inference Latency</span>
          <span className="text-blue-700 font-bold font-mono-tech text-base">
            {result ? `${result.inferenceTimeMs} ms` : '--'}
          </span>
        </div>

        {/* Progress bar showing latency stage split */}
        {result && (
          <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden flex border border-slate-200">
            <div
              style={{
                width: `${(result.preProcessingMs / result.inferenceTimeMs) * 100}%`,
              }}
              className="bg-sky-400 h-full"
              title={`Pre-processing: ${result.preProcessingMs} ms`}
            />
            <div
              style={{
                width: `${( (isFpga ? result.nceExecutionMs : result.inferenceTimeMs - result.preProcessingMs - result.postProcessingMs) / result.inferenceTimeMs) * 100}%`,
              }}
              className={isFpga ? 'bg-blue-600 h-full' : 'bg-slate-500 h-full'}
              title={`Compute Kernel: ${isFpga ? result.nceExecutionMs : 'CPU Exec'} ms`}
            />
            <div
              style={{
                width: `${(result.postProcessingMs / result.inferenceTimeMs) * 100}%`,
              }}
              className="bg-emerald-500 h-full"
              title={`Post-processing: ${result.postProcessingMs} ms`}
            />
          </div>
        )}

        <div className="grid grid-cols-3 gap-2 mt-3 pt-2 border-t border-slate-200 text-[11px]">
          <div>
            <span className="text-[#718096] block text-[10px]">Pre-processing</span>
            <span className="text-[#172033] font-semibold font-mono-tech">
              {result ? `${result.preProcessingMs} ms` : '--'}
            </span>
          </div>
          <div>
            <span className="text-[#718096] block text-[10px]">
              {isFpga ? 'NCE Execution' : 'CPU Execution'}
            </span>
            <span className="text-blue-700 font-semibold font-mono-tech">
              {result ? (isFpga ? `${result.nceExecutionMs} ms` : `${(result.inferenceTimeMs - result.preProcessingMs - result.postProcessingMs).toFixed(1)} ms`) : '--'}
            </span>
          </div>
          <div>
            <span className="text-[#718096] block text-[10px]">Post-processing</span>
            <span className="text-emerald-700 font-semibold font-mono-tech">
              {result ? `${result.postProcessingMs} ms` : '--'}
            </span>
          </div>
        </div>
      </div>

      {/* Grid of Secondary Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Throughput */}
        <div className="p-3 rounded-lg bg-[#F8FAFC] border border-[#D9E2EC]">
          <span className="text-[11px] text-[#526174] block font-medium">Throughput</span>
          <div className="flex items-baseline gap-1 mt-1 font-mono-tech">
            <span className="text-xl font-bold text-[#172033]">
              {result ? result.fps : '--'}
            </span>
            <span className="text-[11px] text-[#718096]">FPS</span>
          </div>
          <span className="text-[11px] text-emerald-600 font-medium mt-0.5 block">
            {isFpga ? '↑ 7.7x vs CPU' : 'Baseline'}
          </span>
        </div>

        {/* CPU Utilization */}
        <div className="p-3 rounded-lg bg-[#F8FAFC] border border-[#D9E2EC]">
          <span className="text-[11px] text-[#526174] block font-medium">CPU Load</span>
          <div className="flex items-baseline gap-1 mt-1 font-mono-tech">
            <span className="text-xl font-bold text-[#172033]">
              {result ? `${result.cpuUtilization}%` : '--'}
            </span>
          </div>
          <span className="text-[11px] text-[#718096] mt-0.5 block">
            {isFpga ? 'Host Free' : 'High Load'}
          </span>
        </div>

        {/* FPGA Utilization */}
        <div className="p-3 rounded-lg bg-[#F8FAFC] border border-[#D9E2EC]">
          <span className="text-[11px] text-[#526174] block font-medium">FPGA Load</span>
          <div className="flex items-baseline gap-1 mt-1 font-mono-tech">
            <span className="text-xl font-bold text-blue-700">
              {result ? `${result.fpgaUtilization}%` : '--'}
            </span>
          </div>
          <span className="text-[11px] text-blue-600 font-medium mt-0.5 block">
            {isFpga ? 'Active Systolic' : '0% (Idle)'}
          </span>
        </div>

        {/* Energy / Inference */}
        <div className="p-3 rounded-lg bg-[#F8FAFC] border border-[#D9E2EC]">
          <span className="text-[11px] text-[#526174] block font-medium">Energy / Frame</span>
          <div className="flex items-baseline gap-1 mt-1 font-mono-tech">
            <span className="text-xl font-bold text-[#172033]">
              {result ? `${result.energyJoules} J` : '--'}
            </span>
          </div>
          <span className="text-[11px] text-emerald-600 font-medium mt-0.5 block">
            {isFpga ? '↓ 85.8% Energy' : 'High Draw'}
          </span>
        </div>
      </div>
    </div>
  );
};
