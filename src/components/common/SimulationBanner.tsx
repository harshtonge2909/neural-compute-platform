import React from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { useSystem } from '../../context/SystemContext';

export const SimulationBanner: React.FC = () => {
  const { hardwareMode, setHardwareMode } = useSystem();

  if (hardwareMode === 'hardware') {
    return (
      <div className="bg-emerald-50 border-b border-emerald-200 px-4 py-1.5 flex items-center justify-between text-xs font-sans">
        <div className="flex items-center gap-2 text-emerald-800">
          <span className="flex h-2 w-2 relative">
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600" />
          </span>
          <span className="font-semibold tracking-wide">Hardware Connected</span>
          <span className="text-emerald-700/80 hidden md:inline">
            — Real-time communication active with Milk-V Mars (StarFive JH7110 RISC-V) & FPGA NCE
          </span>
        </div>
        <button
          onClick={() => setHardwareMode('simulation')}
          className="text-[11px] underline text-emerald-800 hover:text-emerald-950 font-medium transition-colors cursor-pointer"
        >
          Switch to Simulation Mode
        </button>
      </div>
    );
  }

  return (
    <div className="bg-amber-50 border-b border-amber-200 px-4 py-1.5 flex items-center justify-between text-xs font-sans">
      <div className="flex items-center gap-2 text-amber-900">
        <span className="flex h-2 w-2 relative">
          <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
        </span>
        <span className="font-semibold tracking-wide px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-300 text-[11px]">
          Simulation Mode
        </span>
        <span className="text-amber-800/90 hidden sm:inline text-[11px]">
          Metrics and bounding boxes are simulated for offline demonstration. Switch to Hardware Connected when physical board is attached.
        </span>
      </div>
      <button
        onClick={() => setHardwareMode('hardware')}
        className="text-[11px] text-amber-900 hover:text-black font-semibold bg-amber-100/80 px-2.5 py-0.5 rounded border border-amber-300 transition-colors cursor-pointer"
      >
        Connect Hardware
      </button>
    </div>
  );
};
