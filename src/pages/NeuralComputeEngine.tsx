import React, { useState } from 'react';
import { useSystem } from '../context/SystemContext';
import { NCEBlockDiagram } from '../components/nce/NCEBlockDiagram';
import { HardwareGauges } from '../components/nce/HardwareGauges';
import { BlockDetailsModal } from '../components/nce/BlockDetailsModal';
import { RuntimeLog } from '../components/common/RuntimeLog';
import { RefreshCw } from 'lucide-react';

export const NeuralComputeEngine: React.FC = () => {
  const { nceStatus, triggerNCEPulse, addLog } = useSystem();
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
            onClick={handleManualPulse}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 border border-[#D9E2EC] text-[#172033] font-medium text-xs shadow-xs transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-blue-600" />
            <span>Test Diagnostic Pulse</span>
          </button>
        </div>
      </div>

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
