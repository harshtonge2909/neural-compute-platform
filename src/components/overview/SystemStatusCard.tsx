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
    <div className="bg-white rounded-xl p-5 border border-[#D9E2EC] shadow-xs">
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Server className="w-4 h-4 text-blue-600" />
          <h3 className="font-bold text-[#172033] text-sm font-sans tracking-tight">
            System Status & Hardware Platform
          </h3>
        </div>
        <StatusBadge
          status={hardwareMode === 'hardware' ? 'HARDWARE' : 'SIMULATION'}
          variant={hardwareMode === 'hardware' ? 'green' : 'amber'}
          size="sm"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 font-sans text-xs">
        {/* Host */}
        <div className="p-3 rounded-lg bg-[#F8FAFC] border border-[#D9E2EC] flex items-start gap-3">
          <div className="p-2 rounded bg-white border border-slate-200 text-blue-600 shadow-2xs">
            <Server className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[11px] text-[#526174] uppercase font-medium block">Host Platform</span>
            <span className="font-semibold text-[#172033] text-sm">{systemStatus.host}</span>
            <span className="text-[11px] text-[#718096] block mt-0.5">Debian Linux 6.1 (riscv64)</span>
          </div>
        </div>

        {/* Processor */}
        <div className="p-3 rounded-lg bg-[#F8FAFC] border border-[#D9E2EC] flex items-start gap-3">
          <div className="p-2 rounded bg-white border border-slate-200 text-blue-600 shadow-2xs">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[11px] text-[#526174] uppercase font-medium block">Processor</span>
            <span className="font-semibold text-[#172033] text-sm">RISC-V JH7110</span>
            <span className="text-[11px] text-[#718096] block mt-0.5">Quad-Core RV64GC @ 1.5 GHz</span>
          </div>
        </div>

        {/* FPGA */}
        <div className="p-3 rounded-lg bg-[#F8FAFC] border border-[#D9E2EC] flex items-start gap-3">
          <div className="p-2 rounded bg-white border border-slate-200 text-emerald-600 shadow-2xs">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[11px] text-[#526174] uppercase font-medium block">FPGA Subsystem</span>
            <span className="font-semibold text-[#172033] text-sm">FPGA Connected</span>
            <span className="text-[11px] text-[#718096] block mt-0.5">Bitstream: NCE v2.4 (0x4E43)</span>
          </div>
        </div>

        {/* Neural Compute Engine */}
        <div className="p-3 rounded-lg bg-[#F8FAFC] border border-[#D9E2EC] flex items-start gap-3">
          <div className="p-2 rounded bg-white border border-slate-200 text-blue-600 shadow-2xs">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[11px] text-[#526174] uppercase font-medium block">Neural Compute Engine</span>
            <span className="font-semibold text-blue-700 text-sm">READY (Online)</span>
            <span className="text-[11px] text-[#718096] block mt-0.5">64×64 Systolic Array @ 100MHz</span>
          </div>
        </div>

        {/* Runtime */}
        <div className="p-3 rounded-lg bg-[#F8FAFC] border border-[#D9E2EC] flex items-start gap-3">
          <div className="p-2 rounded bg-white border border-slate-200 text-blue-600 shadow-2xs">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[11px] text-[#526174] uppercase font-medium block">AI Runtime</span>
            <span className="font-semibold text-[#172033] text-sm">Running (Daemon)</span>
            <span className="text-[11px] text-[#718096] block mt-0.5">NCA-RT v2.4 (INT8 Quant)</span>
          </div>
        </div>

        {/* Communication */}
        <div className="p-3 rounded-lg bg-[#F8FAFC] border border-[#D9E2EC] flex items-start gap-3">
          <div className="p-2 rounded bg-white border border-slate-200 text-blue-600 shadow-2xs">
            <Radio className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[11px] text-[#526174] uppercase font-medium block">Communication Layer</span>
            <span className="font-semibold text-[#172033] text-sm">Connected (SPI/DMA)</span>
            <span className="text-[11px] text-[#718096] block mt-0.5">50 MHz Bus | CRC32 Verified</span>
          </div>
        </div>
      </div>

      {/* Hardware Telemetry strip */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs font-sans text-[#526174]">
        <div className="flex items-center gap-1.5">
          <Thermometer className="w-3.5 h-3.5 text-blue-600" />
          <span>RISC-V Die Temp: <strong className="text-[#172033] font-mono-tech">{systemStatus.cpuTemperatureC}°C</strong></span>
        </div>
        <div className="flex items-center gap-1.5">
          <Thermometer className="w-3.5 h-3.5 text-blue-600" />
          <span>FPGA Temp: <strong className="text-[#172033] font-mono-tech">{systemStatus.fpgaTemperatureC}°C</strong></span>
        </div>
        <div className="flex items-center gap-1.5">
          <HardDrive className="w-3.5 h-3.5 text-blue-600" />
          <span>LPDDR4 Mem: <strong className="text-[#172033] font-mono-tech">{systemStatus.memoryUsageMb} MB / {systemStatus.totalMemoryMb} MB</strong></span>
        </div>
        <div className="flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-blue-600" />
          <span>Est. Power: <strong className="text-[#172033] font-mono-tech">{nceStatus.powerEstimateWatts} W</strong></span>
        </div>
      </div>
    </div>
  );
};
