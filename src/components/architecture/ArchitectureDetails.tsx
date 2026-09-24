import React from 'react';
import { SystemArchitectureNode } from '../../data/mockData';
import { ShieldAlert, CheckCircle2, Cpu, ArrowRight, Layers, FileCode } from 'lucide-react';

interface ArchitectureDetailsProps {
  node: SystemArchitectureNode;
}

export const ArchitectureDetails: React.FC<ArchitectureDetailsProps> = ({ node }) => {
  return (
    <div className="bg-white rounded-xl p-5 border border-[#D9E2EC] shadow-sm space-y-4">
      {/* Title & Badge */}
      <div className="flex items-start justify-between pb-3 border-b border-[#D9E2EC]">
        <div>
          <span className="text-[10px] font-semibold text-[#526174] uppercase tracking-wider block font-mono">
            SELECTED SUBSYSTEM SPECIFICATION
          </span>
          <h3 className="font-bold text-base text-[#172033] mt-0.5">
            {node.name}
          </h3>
        </div>
        <span
          className="text-xs px-2 py-0.5 rounded border uppercase font-mono font-semibold"
          style={{
            color: node.color,
            borderColor: `${node.color}40`,
            backgroundColor: `${node.color}12`,
          }}
        >
          {node.layer}
        </span>
      </div>

      {/* Purpose */}
      <div>
        <span className="text-[11px] font-semibold text-[#526174] uppercase tracking-wider block mb-1 font-mono">
          PURPOSE & ROLE
        </span>
        <p className="text-xs text-[#172033] font-sans leading-relaxed p-3 rounded-lg bg-[#F8FAFC] border border-[#D9E2EC]">
          {node.details.purpose}
        </p>
      </div>

      {/* Key Responsibilities */}
      <div>
        <span className="text-[11px] font-semibold text-[#526174] uppercase tracking-wider block mb-2 font-mono">
          ENGINEERING RESPONSIBILITIES
        </span>
        <div className="space-y-1.5 font-sans text-xs">
          {node.details.responsibilities.map((resp, i) => (
            <div key={i} className="flex items-start gap-2 text-[#172033]">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 mt-0.5 shrink-0" />
              <span>{resp}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Hardware / Software Details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
        <div className="p-3 rounded-lg bg-[#F8FAFC] border border-[#D9E2EC]">
          <span className="text-[10px] font-semibold text-[#526174] uppercase block mb-1 font-mono">Implementation</span>
          <span className="font-semibold text-[#172033]">{node.details.hardwareSoftware}</span>
        </div>

        <div className="p-3 rounded-lg bg-[#F8FAFC] border border-[#D9E2EC]">
          <span className="text-[10px] font-semibold text-[#526174] uppercase block mb-1 font-mono">Key Interfaces</span>
          <div className="space-y-0.5">
            {node.details.keyInterfaces.map((item, i) => (
              <span key={i} className="block text-blue-700 text-[11px] font-mono">
                • {item}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Data Formats */}
      <div className="p-3 rounded-lg bg-[#F8FAFC] border border-[#D9E2EC] text-xs">
        <span className="text-[10px] font-semibold text-[#526174] uppercase block mb-1 font-mono">Supported Data Formats</span>
        <div className="flex flex-wrap gap-1.5 mt-1">
          {node.details.dataFormats.map((fmt, i) => (
            <span
              key={i}
              className="px-2 py-0.5 rounded bg-white border border-[#D9E2EC] text-[#172033] text-[11px] font-mono shadow-2xs font-medium"
            >
              {fmt}
            </span>
          ))}
        </div>
      </div>

      {/* Architecture Separation Callout */}
      <div className="p-3.5 rounded-lg bg-blue-50/70 border border-blue-200 text-xs flex items-start gap-2.5">
        <ShieldAlert className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
        <div className="font-sans text-[#172033] leading-relaxed text-[11px]">
          <strong className="text-blue-900 font-mono block mb-0.5 uppercase tracking-wide">
            Architectural Separation Principle:
          </strong>
          The frontend strictly interfaces with the AI REST API / Runtime. It does NOT communicate directly with the FPGA. The communication layer isolates the host from the physical SPI / DMA bus so transport protocols can be exchanged transparently.
        </div>
      </div>
    </div>
  );
};
