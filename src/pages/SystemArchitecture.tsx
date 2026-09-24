import React, { useState } from 'react';
import { ARCHITECTURE_NODES, SystemArchitectureNode } from '../data/mockData';
import { SystemArchitectureDiagram } from '../components/architecture/SystemArchitectureDiagram';
import { ArchitectureDetails } from '../components/architecture/ArchitectureDetails';
import { RuntimeLog } from '../components/common/RuntimeLog';

export const SystemArchitecture: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<SystemArchitectureNode>(ARCHITECTURE_NODES[0]);

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#D9E2EC]">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-bold text-[#172033] tracking-tight">
              System Architecture
            </h1>
            <span className="text-xs px-2 py-0.5 rounded bg-blue-50 border border-blue-200 text-blue-700 font-mono font-semibold">
              Full Hardware/Software Stack
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#526174] mt-1">
            Layered Microarchitecture: AI Application &rarr; AI Runtime &rarr; Communication Layer &rarr; RISC-V &rarr; FPGA NCE
          </p>
        </div>

        <div className="text-xs font-mono text-[#526174]">
          Hardware Abstraction: <strong className="text-emerald-700 font-semibold">ISOLATED</strong>
        </div>
      </div>

      {/* Two Column Interactive Architecture Diagram & Technical Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Diagram */}
        <div className="lg:col-span-6">
          <SystemArchitectureDiagram
            selectedNode={selectedNode}
            onSelectNode={setSelectedNode}
          />
        </div>

        {/* Right: Technical Inspector Panel */}
        <div className="lg:col-span-6">
          <ArchitectureDetails node={selectedNode} />
        </div>
      </div>

      {/* System Event Logs */}
      <RuntimeLog maxHeight="max-h-48" title="System Driver & Architecture Bus Log" />
    </div>
  );
};
