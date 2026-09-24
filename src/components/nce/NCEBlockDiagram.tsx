import React from 'react';
import { NCEBlock, BlockStatus } from '../../types';
import { Zap, ArrowDown } from 'lucide-react';
import { useSystem } from '../../context/SystemContext';

interface NCEBlockDiagramProps {
  blocks: Record<string, NCEBlock>;
  selectedBlockId: string | null;
  onSelectBlock: (id: string) => void;
}

export const NCEBlockDiagram: React.FC<NCEBlockDiagramProps> = ({
  blocks,
  selectedBlockId,
  onSelectBlock,
}) => {
  const { isInferring } = useSystem();

  const getStatusBadge = (status: BlockStatus, isSelected: boolean) => {
    switch (status) {
      case 'ACTIVE':
        return (
          <span className="flex items-center gap-1 text-[10px] font-sans text-blue-700 font-semibold bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-ping" />
            Active
          </span>
        );
      case 'WAITING':
        return (
          <span className="text-[10px] font-sans text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
            Waiting
          </span>
        );
      default:
        return (
          <span className="text-[10px] font-sans text-[#718096] bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
            Idle
          </span>
        );
    }
  };

  const renderBlock = (id: string, widthClass = 'w-full') => {
    const block = blocks[id];
    if (!block) return null;
    const isSelected = selectedBlockId === id;
    const isActive = block.status === 'ACTIVE' || isInferring;

    return (
      <div
        onClick={() => onSelectBlock(id)}
        className={`${widthClass} rounded-lg p-3 cursor-pointer transition-all duration-150 border flex flex-col justify-between relative group ${
          isSelected
            ? 'border-blue-600 bg-blue-50/70 shadow-xs ring-1 ring-blue-500'
            : isActive
            ? 'border-blue-400 bg-blue-50/50 shadow-2xs'
            : 'border-[#D9E2EC] hover:border-slate-300 bg-white shadow-2xs'
        }`}
      >
        <div className="flex items-center justify-between gap-1 mb-1">
          <span className="font-sans text-[10px] text-[#718096] uppercase tracking-wider font-semibold">
            {block.category}
          </span>
          {getStatusBadge(isActive ? 'ACTIVE' : block.status, isSelected)}
        </div>

        <div className="my-1">
          <h4 className="font-sans font-semibold text-xs md:text-sm text-[#172033] group-hover:text-blue-700 transition-colors">
            {block.shortName}
          </h4>
          <p className="text-[10px] text-[#526174] font-sans line-clamp-1 mt-0.5">
            {block.description}
          </p>
        </div>

        {/* Activity bar */}
        <div className="mt-2 pt-1.5 border-t border-slate-100 flex items-center justify-between text-[10px] font-sans">
          <span className="text-[#718096]">Load</span>
          <div className="flex items-center gap-1.5 font-mono-tech">
            <div className="w-16 bg-slate-100 h-1.5 rounded-full overflow-hidden border border-slate-200">
              <div
                className={`h-full rounded-full transition-all duration-200 ${
                  isActive ? 'bg-blue-600' : 'bg-slate-400'
                }`}
                style={{ width: `${isActive ? 85 : block.activityPercentage}%` }}
              />
            </div>
            <span className={isActive ? 'text-blue-700 font-bold' : 'text-[#526174]'}>
              {isActive ? '85%' : `${block.activityPercentage}%`}
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl p-5 border border-[#D9E2EC] shadow-xs space-y-5 font-sans relative overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-blue-600" />
          <h3 className="font-bold text-[#172033] text-sm tracking-tight">
            FPGA Neural Compute Engine (NCE) Architecture Diagram
          </h3>
        </div>
        <div className="text-[11px] text-[#526174]">
          Click any block to inspect hardware registers & RTL specs
        </div>
      </div>

      {/* Graphical Tree Block Diagram */}
      <div className="flex flex-col items-center max-w-4xl mx-auto py-2">
        {/* Top: Root NCE Header */}
        <div className="px-6 py-2.5 rounded-lg bg-blue-50 border border-blue-200 text-center shadow-2xs">
          <span className="font-sans font-bold text-sm text-blue-900 tracking-wide block">
            Neural Compute Engine (NCE) Core
          </span>
          <span className="block text-[11px] text-[#526174] font-mono-tech mt-0.5">
            64×64 Systolic Array Coprocessor @ 100 MHz
          </span>
        </div>

        {/* Stem 1 */}
        <div className="w-0.5 h-6 bg-slate-300 relative">
          {isInferring && <div className="w-1.5 h-1.5 rounded-full bg-blue-600 -left-0.5 absolute animate-ping" />}
        </div>

        {/* Level 1: Split into Controller and Memory Subsystems */}
        <div className="w-full max-w-2xl relative">
          <div className="h-0.5 bg-slate-300 w-3/4 mx-auto" />
          <div className="flex justify-between w-3/4 mx-auto">
            <div className="w-0.5 h-4 bg-slate-300" />
            <div className="w-0.5 h-4 bg-slate-300" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {renderBlock('controller')}
            {renderBlock('on_chip_memory')}
          </div>
        </div>

        {/* Stem 2 */}
        <div className="w-full max-w-2xl flex justify-between px-16 my-2 text-slate-400">
          <ArrowDown className="w-4 h-4 mx-auto text-slate-400" />
          <ArrowDown className="w-4 h-4 mx-auto text-slate-400" />
        </div>

        {/* Level 2: Compute Core (MAC Array, Matrix Engine, Tensor Buffer) */}
        <div className="w-full max-w-3xl grid grid-cols-1 md:grid-cols-3 gap-3">
          {renderBlock('mac_array')}
          {renderBlock('matrix_engine')}
          {renderBlock('tensor_buffer')}
        </div>

        {/* Stem 3 */}
        <div className="w-0.5 h-6 bg-slate-300 my-2" />

        {/* Level 3: Spatial Convolution Unit */}
        <div className="w-full max-w-xl">
          {renderBlock('conv_unit')}
        </div>

        {/* Stem 4 */}
        <div className="w-0.5 h-6 bg-slate-300 my-2" />

        {/* Level 4: Activation Unit */}
        <div className="w-full max-w-md">
          {renderBlock('activation_unit')}
        </div>

        {/* Stem 5 */}
        <div className="w-0.5 h-6 bg-slate-300 my-2" />

        {/* Level 5: Pooling Unit */}
        <div className="w-full max-w-sm">
          {renderBlock('pooling_unit')}
        </div>
      </div>
    </div>
  );
};
