import React from 'react';
import { 
  ArrowRight, 
  Cpu, 
  Database, 
  Layers, 
  Zap, 
  CheckCircle2, 
  Activity, 
} from 'lucide-react';
import { useSystem } from '../../context/SystemContext';

export const PipelineVisualization: React.FC = () => {
  const { isInferring, demoMode, nceStatus, setActivePage, hardwareMode } = useSystem();

  const pipelineStages = [
    {
      id: 'app',
      name: 'AI Application',
      subtext: 'YOLO / Tiny LLM',
      icon: <Layers className="w-4 h-4 text-blue-600" />,
    },
    {
      id: 'runtime',
      name: 'AI Runtime',
      subtext: 'Model & Tensors',
      icon: <Database className="w-4 h-4 text-blue-600" />,
    },
    {
      id: 'comm',
      name: 'Comm Layer',
      subtext: 'SPI / DMA Bus',
      icon: <Activity className="w-4 h-4 text-blue-600" />,
    },
    {
      id: 'host',
      name: 'Milk-V Mars',
      subtext: 'RISC-V JH7110',
      icon: <Cpu className="w-4 h-4 text-blue-600" />,
    },
    {
      id: 'fpga',
      name: 'FPGA NCE',
      subtext: 'Systolic Accelerator',
      icon: <Zap className="w-4 h-4 text-blue-600" />,
      isNCE: true,
    },
    {
      id: 'result',
      name: 'Inference Result',
      subtext: 'BBoxes / Tokens',
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-600" />,
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
    <div className="bg-white rounded-xl p-5 border border-[#D9E2EC] shadow-xs relative overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-4 border-b border-slate-100 gap-2">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-[#172033] text-sm md:text-base font-sans tracking-tight">
              Accelerator Pipeline & Dataflow
            </h3>
          </div>
          <p className="text-xs text-[#526174] mt-0.5 font-sans">
            End-to-end inference flow from application layer down to FPGA systolic compute engine
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-sans">
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-[#526174]">
            <span className={`w-2 h-2 rounded-full ${isLive ? 'bg-blue-600 animate-pulse' : 'bg-slate-400'}`} />
            <span className="font-medium text-[11px]">
              {hardwareMode === 'hardware' ? 'Hardware Data' : 'Simulation Data'}
            </span>
          </span>
          <button
            onClick={() => setActivePage('architecture')}
            className="text-blue-600 hover:text-blue-800 text-[11px] font-medium underline cursor-pointer"
          >
            Architecture Details &rarr;
          </button>
        </div>
      </div>

      {/* Horizontal Pipeline flow */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3 relative py-1">
        {pipelineStages.map((stage, idx) => (
          <div key={stage.id} className="flex flex-col relative group">
            {/* Stage Box */}
            <div
              className={`rounded-lg p-3.5 border transition-all duration-200 relative flex flex-col justify-between min-h-[105px] bg-[#F8FAFC] border-[#D9E2EC] hover:border-blue-300 ${
                isLive ? 'border-blue-300' : ''
              }`}
            >
              {/* Corner badge */}
              <div className="flex items-center justify-between">
                <div className="p-1 rounded bg-white border border-slate-200 shadow-2xs">
                  {stage.icon}
                </div>
                <span className="text-[11px] font-mono-tech text-[#718096]">
                  0{idx + 1}
                </span>
              </div>

              <div>
                <h4 className="font-semibold text-xs font-sans text-[#172033] mt-2">
                  {stage.name}
                </h4>
                <p className="text-[11px] font-sans text-[#526174]">
                  {stage.subtext}
                </p>
              </div>

              {/* Data packet flow indicator line */}
              {isLive && (
                <div className="absolute -bottom-0.5 left-2 right-2 h-0.5 bg-slate-200 overflow-hidden rounded-full">
                  <div className="h-full bg-blue-600 rounded-full animate-flow-packet" />
                </div>
              )}
            </div>

            {/* Arrow connector between stages on desktop */}
            {idx < pipelineStages.length - 1 && (
              <div className="hidden xl:flex absolute -right-2 top-1/2 -translate-y-1/2 z-10 text-slate-400">
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Embedded FPGA NCE Internal Microarchitecture Detail */}
      <div className="mt-5 pt-4 border-t border-slate-100 bg-[#F8FAFC] p-4 rounded-lg border border-[#D9E2EC]">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-semibold font-sans text-[#172033]">
              FPGA Neural Compute Engine (NCE) — Internal Coprocessor Blocks
            </span>
          </div>
          <span className="text-[11px] font-mono-tech text-[#526174]">
            64×64 Systolic Core @ 100MHz | INT8 Quantized
          </span>
        </div>

        {/* The 7 Internal Blocks */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {nceInternalBlocks.map((block) => {
            const blockState = nceStatus.blocks[block.id];
            const isActive = blockState?.status === 'ACTIVE' || (isLive && Math.random() > 0.45);

            return (
              <div
                key={block.id}
                className={`p-2.5 rounded-lg border transition-all text-center flex flex-col justify-between ${
                  isActive
                    ? 'bg-blue-50/90 border-blue-400 text-blue-900 shadow-2xs'
                    : 'bg-white border-[#D9E2EC] text-[#526174] hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] mb-1">
                  <span className="font-mono-tech text-slate-500">{block.tag}</span>
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isActive ? 'bg-blue-600' : 'bg-slate-300'
                    }`}
                  />
                </div>
                <span className="font-medium text-xs font-sans text-[#172033] truncate">
                  {block.name}
                </span>
                <span className={`text-[10px] font-mono-tech mt-1 font-medium ${isActive ? 'text-blue-700' : 'text-slate-400'}`}>
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
