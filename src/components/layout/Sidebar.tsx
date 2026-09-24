import React from 'react';
import { 
  LayoutDashboard, 
  Scan, 
  TerminalSquare, 
  Cpu, 
  BarChart3, 
  Network, 
  X,
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
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-white border-r border-[#D9E2EC] flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Header in Sidebar */}
        <div className="h-16 px-5 border-b border-[#D9E2EC] flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono-tech font-extrabold text-base text-blue-700 tracking-wider">
                NCA
              </span>
              <span className="text-xs text-[#172033] font-bold tracking-wide font-sans">
                PLATFORM
              </span>
            </div>
            <p className="text-[11px] text-[#526174] font-sans leading-none mt-0.5">
              Neural Computing Architecture
            </p>
          </div>

          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded text-slate-400 hover:text-slate-700 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* System Online Status Indicator */}
        <div className="px-5 py-3 border-b border-[#D9E2EC] bg-[#F8FAFC]">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 relative">
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600" />
              </span>
              <span className="font-semibold text-emerald-800 tracking-wide text-[11px] font-sans">
                System Online
              </span>
            </div>

            <span className="text-[10px] font-sans font-medium px-1.5 py-0.5 rounded bg-white border border-[#D9E2EC] text-[#526174]">
              {hardwareMode === 'hardware' ? 'Physical HW' : 'Simulated'}
            </span>
          </div>
          <div className="text-[11px] font-sans text-[#718096] mt-1 flex justify-between">
            <span>Host: Milk-V Mars</span>
            <span className="font-mono-tech">1.5 GHz RV64GC</span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <div className="px-3 pb-2 text-[11px] font-sans uppercase tracking-wider text-[#718096] font-semibold">
            Navigation
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
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-md text-xs font-medium font-sans transition-all text-left cursor-pointer ${
                  isActive
                    ? 'bg-blue-50/80 text-blue-700 font-semibold border-l-3 border-blue-600 shadow-xs'
                    : 'text-[#526174] hover:text-[#172033] hover:bg-slate-50 border-l-3 border-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className={isActive ? 'text-blue-600' : 'text-slate-400'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded border font-mono-tech ${
                      isActive
                        ? 'bg-blue-100/60 border-blue-200 text-blue-800'
                        : 'bg-slate-100 border-slate-200 text-slate-500'
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
        <div className="p-4 border-t border-[#D9E2EC] bg-[#F8FAFC] font-sans text-xs space-y-1">
          <div className="flex items-center justify-between text-[#526174]">
            <span>Engine:</span>
            <span className="font-mono-tech font-semibold text-[#172033]">NCE v2.4 (64×64 MAC)</span>
          </div>
          <div className="flex items-center justify-between text-[#526174]">
            <span>On-Chip SRAM:</span>
            <span className="font-mono-tech font-semibold text-[#172033]">1024 KB BRAM</span>
          </div>
          <div className="pt-2 mt-2 border-t border-[#D9E2EC] text-center text-[#718096] text-[10px]">
            Final Year Engineering Project 2026
          </div>
        </div>
      </aside>
    </>
  );
};
