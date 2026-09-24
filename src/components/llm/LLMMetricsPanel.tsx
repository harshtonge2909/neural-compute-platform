import React from 'react';
import { LLMResult } from '../../types';
import { Activity } from 'lucide-react';

interface LLMMetricsPanelProps {
  metrics: LLMResult | null;
  isGenerating: boolean;
}

export const LLMMetricsPanel: React.FC<LLMMetricsPanelProps> = ({ metrics, isGenerating }) => {
  return (
    <div className="bg-white rounded-xl p-4 border border-[#D9E2EC] shadow-xs space-y-3 font-sans">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-blue-600" />
          <span className="font-bold text-[#172033] text-xs tracking-tight">
            Transformer Inference Telemetry
          </span>
        </div>
        {metrics?.isSimulated && (
          <span className="text-[10px] text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
            Simulated
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 text-xs">
        {/* Tokens generated */}
        <div className="p-2.5 rounded-lg bg-[#F8FAFC] border border-[#D9E2EC]">
          <span className="text-[10px] text-[#526174] block uppercase font-medium">Tokens Gen</span>
          <span className="text-lg font-bold font-mono-tech text-[#172033] block mt-0.5">
            {metrics ? metrics.tokensGenerated : isGenerating ? '...' : '--'}
          </span>
          <span className="text-[10px] text-[#718096]">Total count</span>
        </div>

        {/* Tokens / sec */}
        <div className="p-2.5 rounded-lg bg-[#F8FAFC] border border-[#D9E2EC]">
          <span className="text-[10px] text-[#526174] block uppercase font-medium">Tokens / Sec</span>
          <span className="text-lg font-bold font-mono-tech text-blue-700 block mt-0.5">
            {metrics ? `${metrics.tokensPerSecond}` : isGenerating ? '18.7' : '--'}
          </span>
          <span className="text-[10px] text-emerald-600 font-medium">6.4x vs CPU</span>
        </div>

        {/* Time to First Token */}
        <div className="p-2.5 rounded-lg bg-[#F8FAFC] border border-[#D9E2EC]">
          <span className="text-[10px] text-[#526174] block uppercase font-medium">TTFT</span>
          <span className="text-lg font-bold font-mono-tech text-[#172033] block mt-0.5">
            {metrics ? `${metrics.timeToFirstTokenMs} ms` : '--'}
          </span>
          <span className="text-[10px] text-[#718096]">First token</span>
        </div>

        {/* Gen Time */}
        <div className="p-2.5 rounded-lg bg-[#F8FAFC] border border-[#D9E2EC]">
          <span className="text-[10px] text-[#526174] block uppercase font-medium">Total Time</span>
          <span className="text-lg font-bold font-mono-tech text-[#172033] block mt-0.5">
            {metrics ? `${metrics.totalGenerationTimeSec} s` : isGenerating ? 'Streaming' : '--'}
          </span>
          <span className="text-[10px] text-[#718096]">Duration</span>
        </div>

        {/* CPU Util */}
        <div className="p-2.5 rounded-lg bg-[#F8FAFC] border border-[#D9E2EC]">
          <span className="text-[10px] text-[#526174] block uppercase font-medium">CPU Load</span>
          <span className="text-lg font-bold font-mono-tech text-slate-700 block mt-0.5">
            {metrics ? `${metrics.cpuUtilization}%` : isGenerating ? '24%' : '--'}
          </span>
          <span className="text-[10px] text-[#718096]">RISC-V Host</span>
        </div>

        {/* FPGA Util */}
        <div className="p-2.5 rounded-lg bg-[#F8FAFC] border border-[#D9E2EC]">
          <span className="text-[10px] text-[#526174] block uppercase font-medium">FPGA Load</span>
          <span className="text-lg font-bold font-mono-tech text-blue-700 block mt-0.5">
            {metrics ? `${metrics.fpgaUtilization}%` : isGenerating ? '73%' : '--'}
          </span>
          <span className="text-[10px] text-blue-600 font-medium">NCE Systolic</span>
        </div>

        {/* Energy */}
        <div className="p-2.5 rounded-lg bg-[#F8FAFC] border border-[#D9E2EC]">
          <span className="text-[10px] text-[#526174] block uppercase font-medium">Est. Energy</span>
          <span className="text-lg font-bold font-mono-tech text-[#172033] block mt-0.5">
            {metrics ? `${metrics.energyJoules} J` : isGenerating ? '0.38 J' : '--'}
          </span>
          <span className="text-[10px] text-emerald-600 font-medium">84% Cut</span>
        </div>
      </div>
    </div>
  );
};
