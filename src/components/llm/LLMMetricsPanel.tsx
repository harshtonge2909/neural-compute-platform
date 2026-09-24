import React from 'react';
import { LLMResult } from '../../types';
import { Activity, Zap, Cpu, Clock, Battery, Hash } from 'lucide-react';

interface LLMMetricsPanelProps {
  metrics: LLMResult | null;
  isGenerating: boolean;
}

export const LLMMetricsPanel: React.FC<LLMMetricsPanelProps> = ({ metrics, isGenerating }) => {
  return (
    <div className="tech-card rounded-xl p-4 border border-slate-800 space-y-3 font-mono-tech">
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyan-400" />
          <span className="font-bold text-slate-100 text-xs tracking-wider">
            TRANSFORMER INFERENCE TELEMETRY
          </span>
        </div>
        {metrics?.isSimulated && (
          <span className="text-[10px] text-amber-400 bg-amber-950/40 px-1.5 py-0.5 rounded border border-amber-800/40 uppercase">
            SIMULATED
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 text-xs">
        {/* Tokens generated */}
        <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
          <span className="text-[10px] text-slate-400 block uppercase">Tokens Gen</span>
          <span className="text-lg font-bold text-slate-100 block mt-0.5">
            {metrics ? metrics.tokensGenerated : isGenerating ? '...' : '--'}
          </span>
          <span className="text-[9px] text-slate-400">Total count</span>
        </div>

        {/* Tokens / sec */}
        <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
          <span className="text-[10px] text-slate-400 block uppercase">Tokens / Sec</span>
          <span className="text-lg font-bold text-cyan-400 block mt-0.5">
            {metrics ? `${metrics.tokensPerSecond}` : isGenerating ? '18.7' : '--'}
          </span>
          <span className="text-[9px] text-emerald-400">6.4x vs CPU</span>
        </div>

        {/* Time to First Token */}
        <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
          <span className="text-[10px] text-slate-400 block uppercase">TTFT</span>
          <span className="text-lg font-bold text-slate-100 block mt-0.5">
            {metrics ? `${metrics.timeToFirstTokenMs} ms` : '--'}
          </span>
          <span className="text-[9px] text-slate-400">Time to first tok</span>
        </div>

        {/* Gen Time */}
        <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
          <span className="text-[10px] text-slate-400 block uppercase">Total Time</span>
          <span className="text-lg font-bold text-slate-100 block mt-0.5">
            {metrics ? `${metrics.totalGenerationTimeSec} s` : isGenerating ? 'Streaming' : '--'}
          </span>
          <span className="text-[9px] text-slate-400">Duration</span>
        </div>

        {/* CPU Util */}
        <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
          <span className="text-[10px] text-slate-400 block uppercase">CPU Load</span>
          <span className="text-lg font-bold text-amber-400 block mt-0.5">
            {metrics ? `${metrics.cpuUtilization}%` : isGenerating ? '24%' : '--'}
          </span>
          <span className="text-[9px] text-slate-400">RISC-V Host</span>
        </div>

        {/* FPGA Util */}
        <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
          <span className="text-[10px] text-slate-400 block uppercase">FPGA Load</span>
          <span className="text-lg font-bold text-emerald-400 block mt-0.5">
            {metrics ? `${metrics.fpgaUtilization}%` : isGenerating ? '73%' : '--'}
          </span>
          <span className="text-[9px] text-emerald-400">NCE Systolic</span>
        </div>

        {/* Energy */}
        <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
          <span className="text-[10px] text-slate-400 block uppercase">Est. Energy</span>
          <span className="text-lg font-bold text-cyan-300 block mt-0.5">
            {metrics ? `${metrics.energyJoules} J` : isGenerating ? '0.38 J' : '--'}
          </span>
          <span className="text-[9px] text-emerald-400">84% Energy Cut</span>
        </div>
      </div>
    </div>
  );
};
