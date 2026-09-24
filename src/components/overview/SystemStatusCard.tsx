import React from 'react';
import { 
  Server, 
  Cpu, 
  Radio, 
  Zap, 
  Layers, 
  Activity, 
  Thermometer, 
  HardDrive 
} from 'lucide-react';
import { useSystem } from '../../context/SystemContext';
import { StatusBadge } from '../common/StatusBadge';

export const SystemStatusCard: React.FC = () => {
  const { systemStatus, nceStatus, hardwareMode } = useSystem();

  return (
    <div className="tech-card rounded-xl p-5 border border-slate-800">
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <Server className="w-4 h-4 text-cyan-400" />
          <h3 className="font-bold text-slate-100 text-sm font-mono-tech tracking-wider">
            SYSTEM STATUS & HARDWARE PLATFORM
          </h3>
        </div>
        <StatusBadge
          status={hardwareMode === 'hardware' ? 'HARDWARE' : 'SIMULATION'}
          variant={hardwareMode === 'hardware' ? 'green' : 'amber'}
          size="sm"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 font-mono-tech text-xs">
        {/* Host */}
        <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 flex items-start gap-3">
          <div className="p-2 rounded bg-slate-800/80 text-cyan-400">
            <Server className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 uppercase block">Host Platform</span>
            <span className="font-bold text-slate-200 text-sm">{systemStatus.host}</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Debian Linux 6.1 (riscv64)</span>
          </div>
        </div>

        {/* Processor */}
        <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 flex items-start gap-3">
          <div className="p-2 rounded bg-slate-800/80 text-amber-400">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 uppercase block">Processor</span>
            <span className="font-bold text-slate-200 text-sm">RISC-V JH7110</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Quad-Core RV64GC @ 1.5 GHz</span>
          </div>
        </div>

        {/* FPGA */}
        <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 flex items-start gap-3">
          <div className="p-2 rounded bg-slate-800/80 text-emerald-400">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 uppercase block">FPGA Subsystem</span>
            <span className="font-bold text-slate-200 text-sm">FPGA Connected</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Bitstream: NCE v2.4 (0x4E43)</span>
          </div>
        </div>

        {/* Neural Compute Engine */}
        <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 flex items-start gap-3">
          <div className="p-2 rounded bg-slate-800/80 text-cyan-400">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 uppercase block">Neural Compute Engine</span>
            <span className="font-bold text-cyan-300 text-sm">READY (Online)</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">64x64 Systolic Array @ 100MHz</span>
          </div>
        </div>

        {/* Runtime */}
        <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 flex items-start gap-3">
          <div className="p-2 rounded bg-slate-800/80 text-purple-400">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 uppercase block">AI Runtime</span>
            <span className="font-bold text-slate-200 text-sm">Running (Daemon)</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">NCA-RT v2.4 (INT8 Quant)</span>
          </div>
        </div>

        {/* Communication */}
        <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 flex items-start gap-3">
          <div className="p-2 rounded bg-slate-800/80 text-blue-400">
            <Radio className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 uppercase block">Communication Layer</span>
            <span className="font-bold text-slate-200 text-sm">Connected (SPI/DMA)</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">50 MHz Bus | CRC32 Verified</span>
          </div>
        </div>
      </div>

      {/* Hardware Telemetry strip */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs font-mono-tech text-slate-400">
        <div className="flex items-center gap-1.5">
          <Thermometer className="w-3.5 h-3.5 text-amber-400" />
          <span>RISC-V Die Temp: <strong className="text-slate-200">{systemStatus.cpuTemperatureC}°C</strong></span>
        </div>
        <div className="flex items-center gap-1.5">
          <Thermometer className="w-3.5 h-3.5 text-emerald-400" />
          <span>FPGA Temp: <strong className="text-slate-200">{systemStatus.fpgaTemperatureC}°C</strong></span>
        </div>
        <div className="flex items-center gap-1.5">
          <HardDrive className="w-3.5 h-3.5 text-cyan-400" />
          <span>LPDDR4 Mem: <strong className="text-slate-200">{systemStatus.memoryUsageMb} MB / {systemStatus.totalMemoryMb} MB</strong></span>
        </div>
        <div className="flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-purple-400" />
          <span>Est. Power: <strong className="text-slate-200">{nceStatus.powerEstimateWatts} W</strong></span>
        </div>
      </div>
    </div>
  );
};
