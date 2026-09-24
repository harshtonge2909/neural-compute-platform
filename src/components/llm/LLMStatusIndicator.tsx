import React from 'react';
import { ArrowRight, Sparkles, Terminal } from 'lucide-react';

interface LLMStatusIndicatorProps {
  isGenerating: boolean;
  activeStage: string;
}

export const LLMStatusIndicator: React.FC<LLMStatusIndicatorProps> = ({
  isGenerating,
  activeStage,
}) => {
  const stages = [
    { id: 'Tokenization', label: 'Tokenization' },
    { id: 'Tensor preparation', label: 'Tensor Prep' },
    { id: 'FPGA execution', label: 'FPGA NCE Exec' },
    { id: 'Token generation', label: 'Streaming Tokens' },
  ];

  if (!isGenerating) {
    return (
      <div className="flex items-center gap-2 text-xs font-mono-tech text-slate-400 bg-slate-900/60 px-3 py-1.5 rounded-lg border border-slate-800">
        <span className="w-2 h-2 rounded-full bg-slate-500" />
        <span>NCE LLM ENGINE: IDLE</span>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2 p-2.5 rounded-lg bg-cyan-950/40 border border-cyan-500/40 font-mono-tech text-xs">
      <div className="flex items-center gap-1.5 text-cyan-300 font-bold mr-2">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
        </span>
        <span>GENERATING</span>
      </div>

      <div className="flex items-center gap-1 text-[11px]">
        {stages.map((stg, i) => {
          const isCurrent = activeStage === stg.id;
          return (
            <React.Fragment key={stg.id}>
              <span
                className={`px-1.5 py-0.5 rounded transition-all ${
                  isCurrent
                    ? 'bg-cyan-500/30 text-cyan-200 border border-cyan-400/60 font-bold shadow-[0_0_8px_rgba(34,211,238,0.3)]'
                    : 'text-slate-400'
                }`}
              >
                {stg.label}
              </span>
              {i < stages.length - 1 && (
                <ArrowRight className="w-3 h-3 text-slate-600" />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
