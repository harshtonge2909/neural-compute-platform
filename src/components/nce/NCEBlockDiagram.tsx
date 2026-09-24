import React from 'react';
import { NCEBlock, BlockStatus } from '../../types';
import { Cpu, Zap, Database, Layers, ArrowDown, Activity, Sparkles } from 'lucide-react';
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
          <span className="flex items-center gap-1 text-[10px] font-mono-tech text-emerald-400 font-bold bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-500/50 shadow-[0_0_8px_rgba(52,211,153,0.4)]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            ACTIVE
          </span>
        );
      case 'WAITING':
        return (
          <span className="text-[10px] font-mono-tech text-amber-400 bg-amber-950/80 px-1.5 py-0.5 rounded border border-amber-500/40">
            WAITING
          </span>
        );
      default:
        return (
          <span className="text-[10px] font-mono-tech text-slate-400 bg-slate-900/80 px-1.5 py-0.5 rounded border border-slate-800">
            IDLE
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
        className={`${widthClass} tech-card rounded-lg p-3 cursor-pointer transition-all duration-200 border flex flex-col justify-between relative group ${
          isSelected
            ? 'border-cyan-400 bg-cyan-950/30 shadow-[0_0_20px_rgba(34,211,238,0.25)] ring-1 ring-cyan-400'
            : isActive
            ? 'border-emerald-500/80 bg-emerald-950/30 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
            : 'border-slate-800 hover:border-slate-700 bg-slate-900/60'
        }`}
      >
        <div className="flex items-center justify-between gap-1 mb-1.5">
          <span className="font-mono-tech text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
            {block.category}
          </span>
          {getStatusBadge(isActive ? 'ACTIVE' : block.status, isSelected)}
        </div>

        <div className="my-1">
          <h4 className="font-mono-tech font-bold text-xs md:text-sm text-slate-100 group-hover:text-cyan-300 transition-colors">
            {block.shortName}
          </h4>
          <p className="text-[10px] text-slate-400 font-mono-tech line-clamp-1 mt-0.5">
            {block.description}
          </p>
        </div>

        {/* Activity bar */}
        <div className="mt-2 pt-1.5 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono-tech">
          <span className="text-slate-400">Load</span>
          <div className="flex items-center gap-1.5">
            <div className="w-16 bg-slate-950 h-1.5 rounded-full overflow-hidden border border-slate-800">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  isActive ? 'bg-emerald-400' : 'bg-cyan-500/50'
                }`}
                style={{ width: `${isActive ? 85 : block.activityPercentage}%` }}
              />
            </div>
            <span className={isActive ? 'text-emerald-400 font-bold' : 'text-slate-300'}>
              {isActive ? '85%' : `${block.activityPercentage}%`}
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="tech-card rounded-xl p-5 border border-slate-800 space-y-5 relative overflow-hidden">
      {/* Background glow lines */}
      <div className="absolute inset-0 bg-radial from-cyan-950/20 via-transparent to-transparent pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800/80 gap-2">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-emerald-400" />
          <h3 className="font-bold text-slate-100 text-sm font-mono-tech tracking-wider">
            FPGA NEURAL COMPUTE ENGINE (NCE) ARCHITECTURE DIAGRAM
          </h3>
        </div>
        <div className="text-[11px] font-mono-tech text-slate-400">
          Click any block to inspect hardware registers & RTL specs
        </div>
      </div>

      {/* Graphical Tree Block Diagram */}
      <div className="flex flex-col items-center max-w-4xl mx-auto py-2 font-mono-tech">
        {/* Top: Root NCE Header */}
        <div className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-cyan-950 via-slate-900 to-emerald-950 border border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.3)] text-center">
          <span className="font-mono-tech font-extrabold text-sm text-cyan-300 tracking-wider">
            NEURAL COMPUTE ENGINE (NCE) CORE
          </span>
          <span className="block text-[10px] text-slate-400">
            64x64 Systolic Array Coprocessor @ 100 MHz
          </span>
        </div>

        {/* Stem 1 */}
        <div className="w-0.5 h-6 bg-slate-700 relative">
          {isInferring && <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 -left-0.5 absolute animate-ping" />}
        </div>

        {/* Level 1: Split into Controller and Memory Subsystems */}
        <div className="w-full max-w-2xl relative">
          {/* Horizontal crossbar */}
          <div className="h-0.5 bg-slate-700 w-3/4 mx-auto" />
          <div className="flex justify-between w-3/4 mx-auto">
            <div className="w-0.5 h-4 bg-slate-700" />
            <div className="w-0.5 h-4 bg-slate-700" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {renderBlock('controller')}
            {renderBlock('on_chip_memory')}
          </div>
        </div>

        {/* Stem 2 */}
        <div className="w-full max-w-2xl flex justify-between px-16 my-2 text-slate-600">
          <ArrowDown className="w-4 h-4 mx-auto text-slate-600" />
          <ArrowDown className="w-4 h-4 mx-auto text-slate-600" />
        </div>

        {/* Level 2: Compute Core (MAC Array, Matrix Engine, Tensor Buffer) */}
        <div className="w-full max-w-3xl grid grid-cols-1 md:grid-cols-3 gap-3">
          {renderBlock('mac_array')}
          {renderBlock('matrix_engine')}
          {renderBlock('tensor_buffer')}
        </div>

        {/* Stem 3 */}
        <div className="w-0.5 h-6 bg-slate-700 my-2" />

        {/* Level 3: Spatial Convolution Unit */}
        <div className="w-full max-w-xl">
          {renderBlock('conv_unit')}
        </div>

        {/* Stem 4 */}
        <div className="w-0.5 h-6 bg-slate-700 my-2" />

        {/* Level 4: Activation Unit */}
        <div className="w-full max-w-md">
          {renderBlock('activation_unit')}
        </div>

        {/* Stem 5 */}
        <div className="w-0.5 h-6 bg-slate-700 my-2" />

        {/* Level 5: Pooling Unit */}
        <div className="w-full max-w-sm">
          {renderBlock('pooling_unit')}
        </div>
      </div>
    </div>
  );
};
