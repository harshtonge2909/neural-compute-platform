import React from 'react';
import { 
  LayoutDashboard, 
  Scan, 
  TerminalSquare, 
  Cpu, 
  BarChart3, 
  Network, 
  X,
  Radio
} from 'lucide-react';
import { NavPage, useSystem } from '../../context/SystemContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { activePage, setActivePage, hardwareMode } = useSystem();

  const navItems: { id: NavPage; label: string; icon: React.ReactNode; badge?: string }[] = [
    {
      id: 'overview',
      label: 'Overview',
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      id: 'detection',
      label: 'Object Detection',
      icon: <Scan className="w-4 h-4" />,
      badge: 'YOLO',
    },
    {
      id: 'llm',
      label: 'Tiny LLM',
      icon: <TerminalSquare className="w-4 h-4" />,
      badge: 'INT8',
    },
    {
      id: 'nce',
      label: 'Neural Compute Engine',
      icon: <Cpu className="w-4 h-4" />,
      badge: 'FPGA',
    },
    {
      id: 'benchmarks',
      label: 'Benchmarks',
      icon: <BarChart3 className="w-4 h-4" />,
      badge: 'CPU vs FPGA',
    },
    {
      id: 'architecture',
      label: 'System Architecture',
      icon: <Network className="w-4 h-4" />,
    },
  ];

  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-[#090d16] border-r border-slate-800/90 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Header in Sidebar */}
        <div className="h-16 px-4 border-b border-slate-800/80 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono-tech font-extrabold text-base text-cyan-400 tracking-wider">
                NCA
              </span>
              <span className="text-[11px] text-slate-300 font-semibold tracking-wide">
                ENGINEERING
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono-tech leading-none mt-0.5">
              Neural Computing Architecture
            </p>
          </div>

          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded text-slate-400 hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* System Online Status Indicator */}
        <div className="px-4 py-3 border-b border-slate-800/60 bg-slate-950/40">
          <div className="flex items-center justify-between text-xs font-mono-tech">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
              </span>
              <span className="font-semibold text-emerald-400 tracking-wider text-[11px]">
                SYSTEM ONLINE
              </span>
            </div>

            <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
              {hardwareMode === 'hardware' ? 'REAL HW' : 'SIMULATED'}
            </span>
          </div>
          <div className="text-[10px] font-mono-tech text-slate-400 mt-1 flex justify-between">
            <span>HOST: Milk-V Mars</span>
            <span>RV64GC @ 1.5GHz</span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
          <div className="px-3 pb-2 text-[10px] font-mono-tech uppercase tracking-wider text-slate-400 font-semibold">
            CONTROL CONSOLE
          </div>
          {navItems.map((item) => {
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActivePage(item.id);
                  onClose();
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium font-mono-tech transition-all text-left group ${
                  isActive
                    ? 'bg-cyan-950/70 border border-cyan-500/50 text-cyan-300 tech-badge-glow'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/80 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className={`transition-colors ${
                      isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-cyan-300'
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`text-[9px] px-1.5 py-0.2 rounded border font-mono-tech tracking-wide ${
                      isActive
                        ? 'bg-cyan-500/20 border-cyan-400/40 text-cyan-300'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer Hardware Info */}
        <div className="p-3.5 border-t border-slate-800/80 bg-slate-950/60 font-mono-tech text-[10px] space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span>ENGINE: NCE v2.4</span>
            <span className="text-cyan-400">64x64 MAC</span>
          </div>
          <div className="flex items-center justify-between text-slate-400">
            <span>MEM: 1024 KB BRAM</span>
            <span className="text-emerald-400">INT8 QUANT</span>
          </div>
          <div className="pt-2 mt-2 border-t border-slate-800/60 text-center text-slate-400 text-[9px]">
            Final Year Engineering Project 2026
          </div>
        </div>
      </aside>
    </>
  );
};
