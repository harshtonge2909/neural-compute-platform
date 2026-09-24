import React from 'react';
import { SystemArchitectureNode } from '../../data/mockData';
import { ShieldAlert, CheckCircle2, Cpu, ArrowRight, Layers, FileCode } from 'lucide-react';

interface ArchitectureDetailsProps {
  node: SystemArchitectureNode;
}

export const ArchitectureDetails: React.FC<ArchitectureDetailsProps> = ({ node }) => {
  return (
    <div className="tech-card rounded-xl p-5 border border-slate-800 space-y-4 font-mono-tech">
      {/* Title & Badge */}
      <div className="flex items-start justify-between pb-3 border-b border-slate-800/80">
        <div>
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
            SELECTED SUBSYSTEM SPECIFICATION
          </span>
          <h3 className="font-bold text-base text-slate-100 mt-0.5">
            {node.name}
          </h3>
        </div>
        <span
          className="text-xs px-2 py-0.5 rounded border uppercase font-bold"
          style={{
            color: node.color,
            borderColor: `${node.color}50`,
            backgroundColor: `${node.color}15`,
          }}
        >
          {node.layer}
        </span>
      </div>

      {/* Purpose */}
      <div>
        <span className="text-[11px] text-slate-400 uppercase tracking-wider block mb-1">
          PURPOSE & ROLE
        </span>
        <p className="text-xs text-slate-300 font-sans leading-relaxed p-3 rounded-lg bg-slate-950/60 border border-slate-800">
          {node.details.purpose}
        </p>
      </div>

      {/* Key Responsibilities */}
      <div>
        <span className="text-[11px] text-slate-400 uppercase tracking-wider block mb-2">
          ENGINEERING RESPONSIBILITIES
        </span>
        <div className="space-y-1.5 font-sans text-xs">
          {node.details.responsibilities.map((resp, i) => (
            <div key={i} className="flex items-start gap-2 text-slate-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 mt-0.5 shrink-0" />
              <span>{resp}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Hardware / Software Details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
        <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase block mb-1">Implementation</span>
          <span className="font-bold text-slate-200">{node.details.hardwareSoftware}</span>
        </div>

        <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase block mb-1">Key Interfaces</span>
          <div className="space-y-0.5">
            {node.details.keyInterfaces.map((item, i) => (
              <span key={i} className="block text-cyan-300 text-[11px]">
                • {item}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Data Formats */}
      <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 text-xs">
        <span className="text-[10px] text-slate-400 uppercase block mb-1">Supported Data Formats</span>
        <div className="flex flex-wrap gap-1.5 mt-1">
          {node.details.dataFormats.map((fmt, i) => (
            <span
              key={i}
              className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300 text-[11px]"
            >
              {fmt}
            </span>
          ))}
        </div>
      </div>

      {/* Architecture Separation Callout */}
      <div className="p-3 rounded-lg bg-blue-950/30 border border-blue-500/30 text-xs flex items-start gap-2.5">
        <ShieldAlert className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
        <div className="font-sans text-slate-300 leading-relaxed text-[11px]">
          <strong className="text-cyan-300 font-mono-tech block mb-0.5 uppercase">
            Architectural Separation Principle:
          </strong>
          The frontend strictly interfaces with the AI REST API / Runtime. It does NOT communicate directly with the FPGA. The communication layer isolates the host from the physical SPI / DMA bus so transport protocols can be exchanged transparently.
        </div>
      </div>
    </div>
  );
};
