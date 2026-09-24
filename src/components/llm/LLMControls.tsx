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
    <div className="tech-card rounded-xl p-4 border border-slate-800 space-y-4">
      {/* Model Selection & Metadata */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
          <label className="text-xs font-mono-tech text-slate-300 font-medium">
            QUANTIZED LANGUAGE MODEL
          </label>
          <div className="flex items-center gap-1.5 text-[10px] font-mono-tech">
            <span className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30 uppercase">
              Simulated Weights
            </span>
            <span className="px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
              INT8 QUANT
            </span>
          </div>
        </div>

        <select
          value={selectedModel}
          onChange={(e) => onSelectModel(e.target.value as any)}
          disabled={disabled}
          className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-2 text-xs font-mono-tech text-slate-200 focus:outline-none focus:border-cyan-500 cursor-pointer disabled:opacity-50"
        >
          <option value="TinyLlama-1.1B">TinyLlama-1.1B (INT8 Quantized, 2048 Context)</option>
          <option value="Custom Tiny LLM (INT8)">Custom Tiny LLM (Transformer Decoder, INT8)</option>
          <option value="Lightweight Transformer">Lightweight Transformer (350M, INT8)</option>
        </select>
      </div>

      {/* Model Specs Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono-tech text-xs">
        <div className="p-2 rounded bg-slate-950/60 border border-slate-800/80 flex items-center gap-2">
          <Layers className="w-3.5 h-3.5 text-cyan-400" />
          <div>
            <span className="text-[10px] text-slate-400 block">Parameters</span>
            <span className="font-bold text-slate-200 text-[11px]">~1.1 Billion</span>
          </div>
        </div>
        <div className="p-2 rounded bg-slate-950/60 border border-slate-800/80 flex items-center gap-2">
          <Cpu className="w-3.5 h-3.5 text-emerald-400" />
          <div>
            <span className="text-[10px] text-slate-400 block">Quantization</span>
            <span className="font-bold text-emerald-300 text-[11px]">INT8 Symmetric</span>
          </div>
        </div>
        <div className="p-2 rounded bg-slate-950/60 border border-slate-800/80 flex items-center gap-2">
          <HardDrive className="w-3.5 h-3.5 text-purple-400" />
          <div>
            <span className="text-[10px] text-slate-400 block">Context Length</span>
            <span className="font-bold text-purple-300 text-[11px]">2048 Tokens</span>
          </div>
        </div>
        <div className="p-2 rounded bg-slate-950/60 border border-slate-800/80 flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <div>
            <span className="text-[10px] text-slate-400 block">Hardware Backend</span>
            <span className="font-bold text-amber-300 text-[11px]">FPGA NCE</span>
          </div>
        </div>
      </div>

      {/* Preset Prompts */}
      <div>
        <label className="text-xs font-mono-tech text-slate-300 block mb-2 font-medium">
          PRESET ENGINEERING PROMPTS (CLICK TO LOAD)
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {LLM_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => onSelectPreset(preset)}
              disabled={disabled}
              className="p-2.5 rounded-lg border border-slate-800 bg-slate-900/50 hover:bg-slate-900 hover:border-cyan-500/60 text-left transition-all group disabled:opacity-50"
            >
              <div className="flex items-center gap-1.5 text-cyan-400 font-mono-tech text-xs font-semibold group-hover:text-cyan-300">
                <Sparkles className="w-3 h-3 text-cyan-400 shrink-0" />
                <span>{preset.title}</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                "{preset.prompt}"
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
