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
      <header className="h-16 bg-white border-b border-[#D9E2EC] px-4 md:px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
        {/* Left Branding */}
        <div className="flex items-center gap-3">
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-2 rounded text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <Layers className="w-5 h-5 text-blue-600" />
            </button>
          )}

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center shadow-xs">
              <span className="font-mono-tech font-bold text-white text-xs tracking-tight">
                NCA
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#172033] text-sm tracking-tight font-sans">
                  NCA Platform
                </span>
                <span className="text-[11px] font-sans font-medium text-blue-700 px-1.5 py-0.2 rounded bg-blue-50 border border-blue-200">
                  v2.4
                </span>
              </div>
              <p className="text-[11px] text-[#526174] font-sans hidden sm:block">
                Neural Computing Architecture
              </p>
            </div>
          </div>
        </div>

        {/* Center Hardware Live Telemetry Statuses */}
        <div className="hidden xl:flex items-center gap-2">
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
            variant={nceStatus.acceleratorUtilization > 50 ? 'blue' : 'green'}
            size="sm"
          />
          <StatusBadge
            label="COMM"
            status={systemStatus.communicationStatus}
            variant="green"
            size="sm"
          />
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2.5">
          {/* Uptime clock */}
          <div className="hidden md:flex items-center gap-1.5 font-mono-tech text-xs text-[#172033] bg-slate-50 px-2.5 py-1 rounded border border-[#D9E2EC]">
            <Clock className="w-3.5 h-3.5 text-blue-600" />
            <span className="text-[#526174] font-sans text-[11px]">Uptime:</span>
            <span>{formatUptime(systemStatus.uptimeSeconds)}</span>
          </div>

          {/* Demo Mode Toggle */}
          <button
            onClick={() => setDemoMode(!demoMode)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-sans transition-all cursor-pointer ${
              demoMode
                ? 'bg-blue-50 border border-blue-300 text-blue-800 font-medium'
                : 'bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-800'
            }`}
            title="Toggle simulated hardware activity generation"
          >
            {demoMode ? (
              <>
                <Play className="w-3 h-3 text-blue-600 fill-blue-600" />
                <span>Demo: ON</span>
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
            className={`px-2.5 py-1 rounded text-xs font-sans font-medium border transition-all cursor-pointer ${
              hardwareMode === 'hardware'
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                : 'bg-amber-50 border-amber-300 text-amber-900'
            }`}
            title="Toggle between Simulation and Real Hardware API"
          >
            {hardwareMode === 'hardware' ? 'Hardware Mode' : 'Simulation Mode'}
          </button>

          {/* Settings modal trigger */}
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="p-1.5 rounded bg-white border border-[#D9E2EC] text-[#526174] hover:text-[#172033] hover:bg-slate-50 transition-colors cursor-pointer"
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
