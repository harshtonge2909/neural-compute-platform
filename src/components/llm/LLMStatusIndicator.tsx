import React from 'react';
import { ArrowRight } from 'lucide-react';

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
    { id: 'FPGA execution', label: 'FPGA Exec' },
    { id: 'Token generation', label: 'Streaming Tokens' },
  ];

  if (!isGenerating) {
    return (
      <div className="flex items-center gap-2 text-xs font-sans text-[#526174] bg-[#F8FAFC] px-3 py-1.5 rounded-lg border border-[#D9E2EC]">
        <span className="w-2 h-2 rounded-full bg-slate-400" />
        <span>NCE LLM Engine: Idle</span>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2 p-2 rounded-lg bg-blue-50 border border-blue-200 font-sans text-xs">
      <div className="flex items-center gap-1.5 text-blue-900 font-semibold mr-1">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-600 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600" />
        </span>
        <span>Generating</span>
      </div>

      <div className="flex items-center gap-1 text-[11px]">
        {stages.map((stg, i) => {
          const isCurrent = activeStage === stg.id;
          return (
            <React.Fragment key={stg.id}>
              <span
                className={`px-2 py-0.5 rounded transition-all ${
                  isCurrent
                    ? 'bg-blue-600 text-white font-semibold shadow-xs'
                    : 'text-[#526174]'
                }`}
              >
                {stg.label}
              </span>
              {i < stages.length - 1 && (
                <ArrowRight className="w-3 h-3 text-slate-400" />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
