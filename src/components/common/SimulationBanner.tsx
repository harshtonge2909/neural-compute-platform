import React from 'react';
import { AlertTriangle, Cpu, Radio } from 'lucide-react';
import { useSystem } from '../../context/SystemContext';

export const SimulationBanner: React.FC = () => {
  const { hardwareMode, setHardwareMode } = useSystem();

  if (hardwareMode === 'hardware') {
    return (
      <div className="bg-emerald-950/40 border-b border-emerald-500/30 px-4 py-1.5 flex items-center justify-between text-xs font-mono-tech">
        <div className="flex items-center gap-2 text-emerald-400">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
          </span>
          <Cpu className="w-3.5 h-3.5" />
          <span className="font-semibold tracking-wider">HARDWARE CONNECTED</span>
          <span className="text-emerald-500/70 hidden md:inline">
            — Real-time communication active with Milk-V Mars (StarFive JH7110 RISC-V) & FPGA NCE
          </span>
        </div>
        <button
          onClick={() => setHardwareMode('simulation')}
          className="text-[11px] underline text-emerald-400 hover:text-emerald-200 transition-colors"
        >
          Switch to Simulation Mode
        </button>
      </div>
    );
  }

  return (
    <div className="bg-amber-950/40 border-b border-amber-500/30 px-4 py-1.5 flex items-center justify-between text-xs font-mono-tech">
      <div className="flex items-center gap-2 text-amber-400">
        <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
        <span className="font-semibold tracking-wider bg-amber-500/20 px-1.5 py-0.5 rounded border border-amber-500/40 text-[10px]">
          SIMULATION MODE
        </span>
        <span className="text-amber-300/80 hidden sm:inline text-[11px]">
          Metrics, bounding boxes, and accelerator telemetry are simulated for offline demonstration. Connect Milk-V Mars hardware to stream physical data.
        </span>
      </div>
      <button
        onClick={() => setHardwareMode('hardware')}
        className="text-[11px] text-amber-400 hover:text-amber-200 flex items-center gap-1 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800/60 transition-colors"
      >
        <Radio className="w-3 h-3" />
        <span>Connect Hardware</span>
      </button>
    </div>
  );
};
