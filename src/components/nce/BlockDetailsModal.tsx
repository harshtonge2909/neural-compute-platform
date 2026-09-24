import React from 'react';
import { X, Cpu } from 'lucide-react';
import { NCEBlock } from '../../types';

interface BlockDetailsModalProps {
  block: NCEBlock;
  onClose: () => void;
}

export const BlockDetailsModal: React.FC<BlockDetailsModalProps> = ({ block, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 font-sans">
      <div className="bg-white rounded-xl border border-[#D9E2EC] w-full max-w-lg overflow-hidden shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#D9E2EC] bg-[#F8FAFC]">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-blue-600" />
            <span className="font-bold text-[#172033] text-sm">
              {block.name}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-xs">
          <div>
            <span className="text-[10px] text-[#718096] uppercase font-semibold block mb-1">
              Microarchitecture Role
            </span>
            <p className="text-[#172033] leading-relaxed text-sm">
              {block.description}
            </p>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-[#F8FAFC] border border-[#D9E2EC]">
            <span className="text-[#526174] font-medium">Hardware Status</span>
            <span
              className={`px-2 py-0.5 rounded text-xs font-semibold uppercase ${
                block.status === 'ACTIVE'
                  ? 'bg-blue-50 text-blue-800 border border-blue-200'
                  : 'bg-slate-100 text-[#526174] border border-slate-200'
              }`}
            >
              {block.status} ({block.activityPercentage}% Activity)
            </span>
          </div>

          {/* Specifications Table */}
          <div>
            <span className="text-[10px] text-[#718096] uppercase font-semibold block mb-2">
              Hardware Parameters & RTL Specs
            </span>
            <div className="rounded-lg bg-[#F8FAFC] border border-[#D9E2EC] divide-y divide-slate-200">
              {Object.entries(block.specs).map(([key, val]) => (
                <div key={key} className="flex items-center justify-between p-2.5">
                  <span className="text-[#526174]">{key}:</span>
                  <span className="text-[#172033] font-mono-tech font-semibold">{val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end px-5 py-3 border-t border-[#D9E2EC] bg-[#F8FAFC]">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs transition-colors cursor-pointer"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
