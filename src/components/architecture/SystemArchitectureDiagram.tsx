import React from 'react';
import { ARCHITECTURE_NODES, SystemArchitectureNode } from '../../data/mockData';
import { ArrowDown, Network, ShieldCheck, ChevronRight, Layers, Sparkles } from 'lucide-react';

interface SystemArchitectureDiagramProps {
  selectedNode: SystemArchitectureNode;
  onSelectNode: (node: SystemArchitectureNode) => void;
}

export const SystemArchitectureDiagram: React.FC<SystemArchitectureDiagramProps> = ({
  selectedNode,
  onSelectNode,
}) => {
  return (
    <div className="bg-white rounded-xl p-6 border border-[#D9E2EC] shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#D9E2EC] gap-2">
        <div className="flex items-center gap-2">
          <Network className="w-4 h-4 text-blue-600" />
          <h3 className="font-semibold text-[#172033] text-sm tracking-tight">
            End-to-End Layered Architecture Stack
          </h3>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-[#526174]">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Strict Hardware/Software Boundary Enforcement</span>
        </div>
      </div>

      {/* Layer Stack */}
      <div className="flex flex-col items-center max-w-xl mx-auto py-2 space-y-2">
        {ARCHITECTURE_NODES.map((node, index) => {
          const isSelected = selectedNode.id === node.id;
          return (
            <React.Fragment key={node.id}>
              {/* Layer Card */}
              <div
                onClick={() => onSelectNode(node)}
                className={`w-full p-4 rounded-xl border transition-all duration-200 cursor-pointer relative group ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50/60 shadow-sm ring-1 ring-blue-500'
                    : 'border-[#D9E2EC] bg-[#F8FAFC] hover:border-blue-300 hover:bg-white'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span
                      className="w-3 h-3 rounded-full shrink-0 shadow-xs"
                      style={{ backgroundColor: node.color }}
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-xs sm:text-sm text-[#172033] group-hover:text-blue-600 transition-colors">
                          {node.name}
                        </h4>
                        <span
                          className="text-[10px] px-1.5 py-0.5 rounded border uppercase font-mono font-semibold"
                          style={{
                            color: node.color,
                            borderColor: `${node.color}40`,
                            backgroundColor: `${node.color}12`,
                          }}
                        >
                          {node.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#526174] font-sans mt-0.5">
                        {node.shortDesc}
                      </p>
                    </div>
                  </div>

                  <ChevronRight
                    className={`w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-transform ${
                      isSelected ? 'rotate-90 text-blue-600' : ''
                    }`}
                  />
                </div>
              </div>

              {/* Arrow Connector between layers */}
              {index < ARCHITECTURE_NODES.length - 1 && (
                <div className="flex flex-col items-center text-slate-400 py-0.5">
                  <ArrowDown className="w-4 h-4 text-slate-400" />
                  {index === 3 && (
                    <span className="text-[10px] font-mono text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200 my-0.5 font-medium shadow-2xs">
                      SPI / AXI Physical Interconnect @ 50 MHz
                    </span>
                  )}
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
