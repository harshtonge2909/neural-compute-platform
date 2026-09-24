import React from 'react';
import { 
  ArrowRight, 
  Cpu, 
  Database, 
  Layers, 
  Zap, 
  CheckCircle2, 
  Activity, 
  Sparkles 
} from 'lucide-react';
import { useSystem } from '../../context/SystemContext';

export const PipelineVisualization: React.FC = () => {
  const { isInferring, demoMode, nceStatus, setActivePage } = useSystem();

  const pipelineStages = [
    {
      id: 'app',
      name: 'AI Application',
      subtext: 'YOLO / Tiny LLM',
      icon: <Layers className="w-4 h-4 text-cyan-400" />,
      color: 'border-cyan-500/40 text-cyan-300 bg-cyan-950/40',
      activeColor: 'border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.4)]',
    },
    {
      id: 'runtime',
      name: 'AI Runtime',
      subtext: 'Model & Tensors',
      icon: <Database className="w-4 h-4 text-sky-400" />,
      color: 'border-sky-500/40 text-sky-300 bg-sky-950/40',
      activeColor: 'border-sky-400 shadow-[0_0_15px_rgba(56,189,248,0.4)]',
    },
    {
      id: 'comm',
      name: 'Comm Layer',
      subtext: 'SPI / DMA Bus',
      icon: <Activity className="w-4 h-4 text-purple-400" />,
      color: 'border-purple-500/40 text-purple-300 bg-purple-950/40',
      activeColor: 'border-purple-400 shadow-[0_0_15px_rgba(192,132,252,0.4)]',
    },
    {
      id: 'host',
      name: 'Milk-V Mars',
      subtext: 'RISC-V JH7110',
      icon: <Cpu className="w-4 h-4 text-amber-400" />,
      color: 'border-amber-500/40 text-amber-300 bg-amber-950/40',
      activeColor: 'border-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.4)]',
    },
    {
      id: 'fpga',
      name: 'FPGA NCE',
      subtext: 'Systolic Accelerator',
      icon: <Zap className="w-4 h-4 text-emerald-400" />,
      color: 'border-emerald-500/40 text-emerald-300 bg-emerald-950/40',
      activeColor: 'border-emerald-400 shadow-[0_0_18px_rgba(52,211,153,0.5)]',
      isNCE: true,
    },
    {
      id: 'result',
      name: 'Inference Result',
      subtext: 'BBoxes / Tokens',
      icon: <CheckCircle2 className="w-4 h-4 text-cyan-400" />,
      color: 'border-cyan-500/40 text-cyan-300 bg-cyan-950/40',
      activeColor: 'border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.4)]',
    },
  ];

  // NCE internal micro-architectural blocks
  const nceInternalBlocks = [
    { id: 'controller', name: 'Controller', tag: 'FSM' },
    { id: 'on_chip_memory', name: 'On-Chip Memory', tag: '1024KB' },
    { id: 'mac_array', name: 'MAC Array', tag: '64x64' },
    { id: 'matrix_engine', name: 'Matrix Mult', tag: 'GEMM' },
    { id: 'conv_unit', name: 'Convolution', tag: '2D Line' },
    { id: 'activation_unit', name: 'Activation', tag: 'LUT' },
    { id: 'pooling_unit', name: 'Pooling', tag: 'Max/Avg' },
  ];

  const isLive = isInferring || demoMode;

  return (
    <div className="tech-card rounded-xl p-5 border border-slate-800 relative overflow-hidden">
      {/* Background glow lines */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-transparent to-emerald-500/5 pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-slate-800/80 gap-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <h3 className="font-bold text-slate-100 text-sm md:text-base font-mono-tech tracking-wide">
              ACCELERATOR PIPELINE & DATAFLOW ARCHITECTURE
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            End-to-end inference flow from application layer down to FPGA systolic compute engine
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono-tech">
          <span className="flex items-center gap-1.5 px-2 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300">
            <span className={`w-2 h-2 rounded-full ${isLive ? 'bg-cyan-400 animate-pulse' : 'bg-slate-500'}`} />
            <span>FLOW: {isInferring ? 'INFERENCE ACTIVE' : demoMode ? 'SIMULATING' : 'IDLE'}</span>
          </span>
          <button
            onClick={() => setActivePage('architecture')}
            className="text-cyan-400 hover:text-cyan-300 underline text-[11px]"
          >
            Full Architecture Details &rarr;
          </button>
        </div>
      </div>

      {/* Horizontal Pipeline flow */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3 relative py-2">
        {pipelineStages.map((stage, idx) => (
          <div key={stage.id} className="flex flex-col relative group">
            {/* Stage Box */}
            <div
              className={`rounded-lg p-3 border transition-all duration-300 relative flex flex-col justify-between min-h-[105px] ${
                stage.color
              } ${isLive ? stage.activeColor : ''}`}
            >
              {/* Corner badge */}
              <div className="flex items-center justify-between">
                <div className="p-1 rounded bg-slate-900/80 border border-slate-800">
                  {stage.icon}
                </div>
                <span className="text-[10px] font-mono-tech text-slate-400">
                  0{idx + 1}
                </span>
              </div>

              <div>
                <h4 className="font-bold text-xs font-mono-tech text-slate-100 mt-2">
                  {stage.name}
                </h4>
                <p className="text-[11px] font-mono-tech text-slate-400">
                  {stage.subtext}
                </p>
              </div>

              {/* Data packet flow indicator dot */}
              {isLive && (
                <div className="absolute -bottom-1 left-2 right-2 h-0.5 bg-slate-800 overflow-hidden rounded-full">
                  <div className="h-full bg-cyan-400 rounded-full animate-flow-packet" />
                </div>
              )}
            </div>

            {/* Arrow connector between stages on desktop */}
            {idx < pipelineStages.length - 1 && (
              <div className="hidden xl:flex absolute -right-2.5 top-1/2 -translate-y-1/2 z-10 text-slate-600">
                <ArrowRight className={`w-3.5 h-3.5 ${isLive ? 'text-cyan-400 animate-pulse' : ''}`} />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Embedded FPGA NCE Internal Microarchitecture Detail */}
      <div className="mt-5 pt-4 border-t border-slate-800/80 bg-slate-950/60 p-4 rounded-lg border border-slate-900">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Zap className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-xs font-bold font-mono-tech text-emerald-300 tracking-wider">
              FPGA NEURAL COMPUTE ENGINE (NCE) — INTERNAL COPROCESSOR BLOCKS
            </span>
          </div>
          <span className="text-[11px] font-mono-tech text-slate-400">
            64x64 Systolic Core @ 100MHz | INT8 Quantized
          </span>
        </div>

        {/* The 7 Internal Blocks */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 font-mono-tech">
          {nceInternalBlocks.map((block) => {
            const blockState = nceStatus.blocks[block.id];
            const isActive = blockState?.status === 'ACTIVE' || (isLive && Math.random() > 0.4);

            return (
              <div
                key={block.id}
                className={`p-2 rounded border transition-all text-center flex flex-col justify-between ${
                  isActive
                    ? 'bg-emerald-950/70 border-emerald-400/80 text-emerald-200 tech-active-block'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between text-[9px] mb-1">
                  <span className="text-slate-400">{block.tag}</span>
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isActive ? 'bg-emerald-400 shadow-[0_0_6px_#34d399]' : 'bg-slate-600'
                    }`}
                  />
                </div>
                <span className="font-semibold text-xs text-slate-200 truncate">
                  {block.name}
                </span>
                <span className={`text-[10px] mt-1 ${isActive ? 'text-emerald-400 font-bold' : 'text-slate-400'}`}>
                  {isActive ? 'ACTIVE' : 'IDLE'}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
