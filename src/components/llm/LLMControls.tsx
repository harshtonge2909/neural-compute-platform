import React from 'react';
import { LLM_PRESETS, LLMPreset } from '../../data/mockData';
import { Sparkles, Cpu, Layers, HardDrive } from 'lucide-react';

interface LLMControlsProps {
  selectedModel: 'TinyLlama-1.1B' | 'Custom Tiny LLM (INT8)' | 'Lightweight Transformer';
  onSelectModel: (m: 'TinyLlama-1.1B' | 'Custom Tiny LLM (INT8)' | 'Lightweight Transformer') => void;
  onSelectPreset: (preset: LLMPreset) => void;
  disabled: boolean;
}

export const LLMControls: React.FC<LLMControlsProps> = ({
  selectedModel,
  onSelectModel,
  onSelectPreset,
  disabled,
}) => {
  return (
    <div className="bg-white rounded-xl p-5 border border-[#D9E2EC] shadow-xs space-y-4 font-sans">
      {/* Model Selection & Metadata */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
          <label className="text-xs font-semibold text-[#172033]">
            Quantized Language Model
          </label>
          <div className="flex items-center gap-1.5 text-[11px]">
            <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
              Simulated Weights
            </span>
            <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 font-mono-tech">
              INT8 Quant
            </span>
          </div>
        </div>

        <select
          value={selectedModel}
          onChange={(e) => onSelectModel(e.target.value as any)}
          disabled={disabled}
          className="w-full bg-white border border-[#D9E2EC] rounded-lg px-3 py-2 text-xs text-[#172033] focus:outline-none focus:border-blue-500 cursor-pointer disabled:opacity-50"
        >
          <option value="TinyLlama-1.1B">TinyLlama-1.1B (INT8 Quantized, 2048 Context)</option>
          <option value="Custom Tiny LLM (INT8)">Custom Tiny LLM (Transformer Decoder, INT8)</option>
          <option value="Lightweight Transformer">Lightweight Transformer (350M, INT8)</option>
        </select>
      </div>

      {/* Model Specs Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
        <div className="p-2.5 rounded-lg bg-[#F8FAFC] border border-[#D9E2EC] flex items-center gap-2">
          <Layers className="w-4 h-4 text-blue-600 shrink-0" />
          <div>
            <span className="text-[10px] text-[#718096] block">Parameters</span>
            <span className="font-semibold text-[#172033] font-mono-tech">~1.1 Billion</span>
          </div>
        </div>
        <div className="p-2.5 rounded-lg bg-[#F8FAFC] border border-[#D9E2EC] flex items-center gap-2">
          <Cpu className="w-4 h-4 text-blue-600 shrink-0" />
          <div>
            <span className="text-[10px] text-[#718096] block">Quantization</span>
            <span className="font-semibold text-[#172033] font-mono-tech">INT8 Symmetric</span>
          </div>
        </div>
        <div className="p-2.5 rounded-lg bg-[#F8FAFC] border border-[#D9E2EC] flex items-center gap-2">
          <HardDrive className="w-4 h-4 text-blue-600 shrink-0" />
          <div>
            <span className="text-[10px] text-[#718096] block">Context Length</span>
            <span className="font-semibold text-[#172033] font-mono-tech">2048 Tokens</span>
          </div>
        </div>
        <div className="p-2.5 rounded-lg bg-[#F8FAFC] border border-[#D9E2EC] flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
          <div>
            <span className="text-[10px] text-[#718096] block">Hardware Target</span>
            <span className="font-semibold text-[#172033]">FPGA NCE</span>
          </div>
        </div>
      </div>

      {/* Preset Prompts */}
      <div>
        <label className="text-xs font-semibold text-[#172033] block mb-2">
          Preset Engineering Prompts (Click to Load)
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {LLM_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => onSelectPreset(preset)}
              disabled={disabled}
              className="p-3 rounded-lg border border-[#D9E2EC] bg-[#F8FAFC] hover:bg-white hover:border-blue-400 text-left transition-all cursor-pointer group disabled:opacity-50"
            >
              <div className="flex items-center gap-1.5 text-blue-700 text-xs font-semibold group-hover:text-blue-800">
                <Sparkles className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>{preset.title}</span>
              </div>
              <p className="text-[11px] text-[#526174] mt-1 line-clamp-1">
                "{preset.prompt}"
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
