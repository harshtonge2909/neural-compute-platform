import React from 'react';
import { X, Cpu, Zap, Database, CheckCircle, Info } from 'lucide-react';
import { NCEBlock } from '../../types';

interface BlockDetailsModalProps {
  block: NCEBlock;
  onClose: () => void;
}

export const BlockDetailsModal: React.FC<BlockDetailsModalProps> = ({ block, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="tech-card rounded-xl border border-slate-700 bg-[#0c101d] w-full max-w-lg overflow-hidden shadow-2xl font-mono-tech">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-900/80">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span className="font-bold text-slate-100 text-sm tracking-wide">
              {block.name.toUpperCase()}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-xs">
          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">
              Microarchitecture Role
            </span>
            <p className="text-slate-300 leading-relaxed font-sans text-sm">
              {block.description}
            </p>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950/70 border border-slate-800">
            <span className="text-slate-400">Current Hardware Status</span>
            <span
              className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${
                block.status === 'ACTIVE'
                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/50'
                  : 'bg-slate-900 text-slate-400 border border-slate-800'
              }`}
            >
              {block.status} ({block.activityPercentage}% Activity)
            </span>
          </div>

          {/* Specifications Table */}
          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-2">
              Hardware Parameters & RTL Specs
            </span>
            <div className="rounded-lg bg-slate-950/70 border border-slate-800 divide-y divide-slate-800/80">
              {Object.entries(block.specs).map(([key, val]) => (
                <div key={key} className="flex items-center justify-between p-2.5">
                  <span className="text-slate-400">{key}:</span>
                  <span className="text-cyan-300 font-bold">{val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end px-5 py-3 border-t border-slate-800 bg-slate-900/40">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-xs transition-colors"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
