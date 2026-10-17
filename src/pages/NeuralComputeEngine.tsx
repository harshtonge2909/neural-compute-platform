import React, { useState } from 'react';
import { useSystem } from '../context/SystemContext';
import { NCEBlockDiagram } from '../components/nce/NCEBlockDiagram';
import { HardwareGauges } from '../components/nce/HardwareGauges';
import { BlockDetailsModal } from '../components/nce/BlockDetailsModal';
import { RuntimeLog } from '../components/common/RuntimeLog';
import { RefreshCw } from 'lucide-react';

export const NeuralComputeEngine: React.FC = () => {
  const { nceStatus, triggerNCEPulse, addLog, setActivePage } = useSystem();
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);

  const handleManualPulse = () => {
    triggerNCEPulse();
    addLog('FPGA', 'NCE', 'Manual diagnostic pulse triggered: all 7 compute blocks activated');
  };

  const selectedBlock = selectedBlockId ? nceStatus.blocks[selectedBlockId] : null;

  return (
    <div className="space-y-6 font-sans">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#D9E2EC]">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-bold text-[#172033] tracking-tight">
              Neural Compute Engine
            </h1>
            <span className="text-xs px-2 py-0.5 rounded bg-blue-50 border border-blue-200 text-blue-700 font-medium">
              FPGA RTL Schematic
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#526174] mt-1">
            Custom Hardware Accelerator Microarchitecture & Physical Silicon Telemetry
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActivePage('settings')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 font-medium text-xs shadow-xs transition-colors cursor-pointer"
          >
            <span>Device Settings</span>
          </button>
          <button
            onClick={handleManualPulse}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 border border-[#D9E2EC] text-[#172033] font-medium text-xs shadow-xs transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-blue-600" />
            <span>Test Diagnostic Pulse</span>
          </button>
        </div>
      </div>

      {/* Honest Hardware Status Banner */}
      {!nceStatus.isAvailable && (
        <div className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/70 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
            <div className="text-[#172033]">
              <strong className="text-amber-900 block font-semibold">FPGA Status: Disconnected / Planned Architecture</strong>
              <span className="text-[#526174]">
                The hardware schematic below outlines the planned 64x64 Systolic Array and BRAM microarchitecture. Physical execution requires a connected Milk-V Mars board or local FPGA driver.
              </span>
            </div>
          </div>
          <button
            onClick={() => setActivePage('settings')}
            className="px-3 py-1.5 rounded bg-white border border-amber-300 text-amber-900 hover:bg-amber-100 font-medium text-[11px] shrink-0 cursor-pointer"
          >
            Connect Hardware
          </button>
        </div>
      )}

      {/* Hardware Telemetry Gauges */}
      <HardwareGauges status={nceStatus} />

      {/* Microarchitecture Block Diagram */}
      <NCEBlockDiagram
        blocks={nceStatus.blocks}
        selectedBlockId={selectedBlockId}
        onSelectBlock={(id) => setSelectedBlockId(id)}
      />

      {/* Embedded Terminal Log */}
      <RuntimeLog maxHeight="max-h-48" title="FPGA Core Event Log" />

      {/* Block Details Inspector Modal */}
      {selectedBlock && (
        <BlockDetailsModal
          block={selectedBlock}
          onClose={() => setSelectedBlockId(null)}
        />
      )}
    </div>
  );
};
