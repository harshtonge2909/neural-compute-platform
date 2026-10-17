import React from 'react';
import { Gauge } from '../common/Gauge';
import { NCEStatus } from '../../types';
import { Cpu, Zap, HardDrive, Radio, Activity } from 'lucide-react';

interface HardwareGaugesProps {
  status: NCEStatus;
}

export const HardwareGauges: React.FC<HardwareGaugesProps> = ({ status }) => {
  return (
    <div className="bg-white rounded-xl p-5 border border-[#D9E2EC] shadow-xs space-y-4 font-sans">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-blue-600" />
          <h3 className="font-bold text-[#172033] text-sm tracking-tight">
            Hardware Telemetry & Physical Metrics
          </h3>
        </div>
        <span className={`text-[11px] font-sans font-medium px-2 py-0.5 rounded border ${
          status.isAvailable 
            ? 'text-emerald-800 bg-emerald-50 border-emerald-200' 
            : 'text-amber-800 bg-amber-50 border-amber-200'
        }`}>
          {status.isAvailable ? 'Sensors Online' : 'Hardware Disconnected'}
        </span>
      </div>

      {/* 4 Primary Gauges */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Gauge
          value={status.acceleratorUtilization ?? 0}
          min={0}
          max={100}
          unit="%"
          label="Accelerator Load"
          color="blue"
          sublabel={status.isAvailable ? "NCE Core" : "Disconnected"}
        />

        <Gauge
          value={status.macUtilization ?? 0}
          min={0}
          max={100}
          unit="%"
          label="Systolic MAC Array"
          color="blue"
          sublabel={status.isAvailable ? "64×64 Grid" : "Disconnected"}
        />

        <Gauge
          value={status.memoryUtilization ?? 0}
          min={0}
          max={100}
          unit="%"
          label="SRAM Utilization"
          color="blue"
          sublabel={status.isAvailable ? `${status.onChipMemoryUsedKb} / ${status.onChipMemoryTotalKb} KB` : "1024 KB Reserved"}
        />

        <Gauge
          value={status.temperatureC ?? 0}
          min={25}
          max={85}
          unit="°C"
          label="Die Temperature"
          color={status.temperatureC && status.temperatureC > 65 ? 'rose' : status.temperatureC && status.temperatureC > 50 ? 'amber' : 'blue'}
          sublabel={status.isAvailable ? "Thermal Limit: 85°C" : "N/A (Offline)"}
        />
      </div>

      {/* Hardware Telemetry Stat Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
        {/* Clock */}
        <div className="p-3 rounded-lg bg-[#F8FAFC] border border-[#D9E2EC] flex items-center gap-2.5">
          <div className="p-2 rounded bg-white border border-slate-200 text-blue-600 shadow-2xs">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] text-[#526174] uppercase font-medium block">Clock Frequency</span>
            <span className="font-bold text-[#172033] text-sm font-mono-tech">
              {status.clockFrequencyMhz ? `${status.clockFrequencyMhz} MHz` : 'N/A'}
            </span>
            <span className="text-[10px] text-[#718096] block">Target: 100 MHz</span>
          </div>
        </div>

        {/* Data Transfer */}
        <div className="p-3 rounded-lg bg-[#F8FAFC] border border-[#D9E2EC] flex items-center gap-2.5">
          <div className="p-2 rounded bg-white border border-slate-200 text-blue-600 shadow-2xs">
            <Radio className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] text-[#526174] uppercase font-medium block">SPI / DMA Transfer</span>
            <span className="font-bold text-blue-700 text-sm font-mono-tech">
              {status.dataTransferRateMBps ? `${status.dataTransferRateMBps} MB/s` : 'N/A'}
            </span>
            <span className="text-[10px] text-[#718096] block">Peak: 50.0 MB/s</span>
          </div>
        </div>

        {/* Power Estimate */}
        <div className="p-3 rounded-lg bg-[#F8FAFC] border border-[#D9E2EC] flex items-center gap-2.5">
          <div className="p-2 rounded bg-white border border-slate-200 text-blue-600 shadow-2xs">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] text-[#526174] uppercase font-medium block">Board Power</span>
            <span className="font-bold text-[#172033] text-sm font-mono-tech">
              {status.powerEstimateWatts ? `${status.powerEstimateWatts} W` : 'N/A'}
            </span>
            <span className="text-[10px] text-[#718096] block">VCC: 1.0V Core / 3.3V I/O</span>
          </div>
        </div>

        {/* SRAM Capacity */}
        <div className="p-3 rounded-lg bg-[#F8FAFC] border border-[#D9E2EC] flex items-center gap-2.5">
          <div className="p-2 rounded bg-white border border-slate-200 text-blue-600 shadow-2xs">
            <HardDrive className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] text-[#526174] uppercase font-medium block">On-Chip BRAM</span>
            <span className="font-bold text-[#172033] text-sm font-mono-tech">
              {status.onChipMemoryUsedKb !== null && status.onChipMemoryUsedKb !== undefined ? `${status.onChipMemoryUsedKb} KB` : '1024 KB Total'}
            </span>
            <span className="text-[10px] text-[#718096] block">Cap: 1024 KB Total</span>
          </div>
        </div>
      </div>
    </div>
  );
};
