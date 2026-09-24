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
    <div className="tech-card rounded-xl p-6 border border-slate-800 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800/80 gap-2">
        <div className="flex items-center gap-2">
          <Network className="w-4 h-4 text-cyan-400" />
          <h3 className="font-bold text-slate-100 text-sm font-mono-tech tracking-wider">
            END-TO-END LAYERED ARCHITECTURE STACK
          </h3>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] font-mono-tech text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Strict Hardware/Software Boundary Enforcement</span>
        </div>
      </div>

      {/* Layer Stack */}
      <div className="flex flex-col items-center max-w-xl mx-auto py-2 font-mono-tech space-y-2">
        {ARCHITECTURE_NODES.map((node, index) => {
          const isSelected = selectedNode.id === node.id;
          return (
            <React.Fragment key={node.id}>
              {/* Layer Card */}
              <div
                onClick={() => onSelectNode(node)}
                className={`w-full p-4 rounded-xl border transition-all duration-200 cursor-pointer relative group ${
                  isSelected
                    ? 'border-cyan-400 bg-cyan-950/40 shadow-[0_0_20px_rgba(34,211,238,0.25)] ring-1 ring-cyan-400'
                    : 'border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: node.color }}
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-xs sm:text-sm text-slate-100 group-hover:text-cyan-300 transition-colors">
                          {node.name}
                        </h4>
                        <span
                          className="text-[9px] px-1.5 py-0.2 rounded border uppercase font-bold"
                          style={{
                            color: node.color,
                            borderColor: `${node.color}50`,
                            backgroundColor: `${node.color}15`,
                          }}
                        >
                          {node.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 font-sans mt-0.5">
                        {node.shortDesc}
                      </p>
                    </div>
                  </div>

                  <ChevronRight
                    className={`w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-transform ${
                      isSelected ? 'rotate-90 text-cyan-400' : ''
                    }`}
                  />
                </div>
              </div>

              {/* Arrow Connector between layers */}
              {index < ARCHITECTURE_NODES.length - 1 && (
                <div className="flex flex-col items-center text-slate-600 py-0.5">
                  <ArrowDown className="w-4 h-4 text-slate-500 animate-pulse" />
                  {index === 3 && (
                    <span className="text-[10px] font-mono-tech text-purple-400 bg-purple-950/80 px-2 py-0.5 rounded border border-purple-800/40 my-0.5">
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
