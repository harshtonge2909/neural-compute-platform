import React, { useState } from 'react';
import { 
  Clock, 
  Settings, 
  Play, 
  Pause, 
  Layers
} from 'lucide-react';
import { useSystem } from '../../context/SystemContext';
import { StatusBadge } from '../common/StatusBadge';
import { formatUptime } from '../../services/system';
import { SettingsModal } from './SettingsModal';

interface TopBarProps {
  onToggleSidebar?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ onToggleSidebar }) => {
  const { 
    systemStatus, 
    nceStatus, 
    demoMode, 
    setDemoMode, 
    hardwareMode, 
    setHardwareMode 
  } = useSystem();

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <>
      <header className="h-16 bg-[#090d16]/95 border-b border-slate-800/80 px-4 flex items-center justify-between sticky top-0 z-30 backdrop-blur-md">
        {/* Left Branding */}
        <div className="flex items-center gap-3">
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-2 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <Layers className="w-5 h-5 text-cyan-400" />
            </button>
          )}

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-gradient-to-br from-cyan-500/20 to-blue-600/30 border border-cyan-500/40 flex items-center justify-center tech-badge-glow">
              <span className="font-mono-tech font-bold text-cyan-400 text-sm tracking-tighter">
                NCA
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-100 text-sm tracking-wide">
                  NCA PLATFORM
                </span>
                <span className="text-[10px] font-mono-tech text-cyan-400 px-1.5 py-0.2 rounded bg-cyan-950/60 border border-cyan-800/40">
                  v2.4
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono-tech hidden sm:block">
                Neural Computing Architecture
              </p>
            </div>
          </div>
        </div>

        {/* Center Hardware Live Telemetry Statuses */}
        <div className="hidden xl:flex items-center gap-2.5">
          <StatusBadge
            label="RISC-V"
            status={systemStatus.processorStatus}
            variant="green"
            pulse={systemStatus.processorStatus === 'ONLINE'}
            size="sm"
          />
          <StatusBadge
            label="FPGA"
            status={systemStatus.fpgaStatus}
            variant="green"
            pulse={systemStatus.fpgaStatus === 'ONLINE'}
            size="sm"
          />
          <StatusBadge
            label="NCE"
            status={nceStatus.acceleratorUtilization > 50 ? 'ACTIVE' : systemStatus.nceState}
            variant={nceStatus.acceleratorUtilization > 50 ? 'cyan' : 'blue'}
            pulse={nceStatus.acceleratorUtilization > 50}
            size="sm"
          />
          <StatusBadge
            label="COMM"
            status={systemStatus.communicationStatus}
            variant="purple"
            size="sm"
          />
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2.5">
          {/* Uptime clock */}
          <div className="hidden md:flex items-center gap-1.5 font-mono-tech text-xs text-slate-300 bg-slate-900/80 px-2.5 py-1 rounded border border-slate-800">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-slate-400 text-[10px]">UPTIME:</span>
            <span>{formatUptime(systemStatus.uptimeSeconds)}</span>
          </div>

          {/* Demo Mode Toggle */}
          <button
            onClick={() => setDemoMode(!demoMode)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded font-mono-tech text-xs border transition-all ${
              demoMode
                ? 'bg-cyan-950/80 border-cyan-500/50 text-cyan-300 tech-badge-glow'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
            title="Toggle simulated hardware activity generation"
          >
            {demoMode ? (
              <>
                <Play className="w-3 h-3 text-cyan-400 fill-cyan-400" />
                <span className="font-semibold">Demo: ON</span>
              </>
            ) : (
              <>
                <Pause className="w-3 h-3 text-slate-400" />
                <span>Demo: OFF</span>
              </>
            )}
          </button>

          {/* Hardware / Simulation Mode Pill */}
          <button
            onClick={() => setHardwareMode(hardwareMode === 'simulation' ? 'hardware' : 'simulation')}
            className={`px-2 py-1 rounded text-[11px] font-mono-tech border transition-all ${
              hardwareMode === 'hardware'
                ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-400'
                : 'bg-amber-950/60 border-amber-500/40 text-amber-300'
            }`}
            title="Toggle between Simulation and Real Hardware API"
          >
            {hardwareMode === 'hardware' ? 'HARDWARE' : 'SIMULATION'}
          </button>

          {/* Settings modal trigger */}
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="p-1.5 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-cyan-400 hover:border-cyan-800 transition-colors"
            title="System Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Settings Modal */}
      {isSettingsOpen && <SettingsModal onClose={() => setIsSettingsOpen(false)} />}
    </>
  );
};
