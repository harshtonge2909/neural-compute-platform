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
        <span className="text-[11px] font-sans font-medium text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
          Sensors Online
        </span>
      </div>

      {/* 4 Primary Gauges */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Gauge
          value={status.acceleratorUtilization}
          min={0}
          max={100}
          unit="%"
          label="Accelerator Load"
          color="blue"
          sublabel="NCE Core"
        />

        <Gauge
          value={status.macUtilization}
          min={0}
          max={100}
          unit="%"
          label="Systolic MAC Array"
          color="blue"
          sublabel="64×64 Grid"
        />

        <Gauge
          value={status.memoryUtilization}
          min={0}
          max={100}
          unit="%"
          label="SRAM Utilization"
          color="blue"
          sublabel={`${status.onChipMemoryUsedKb} / ${status.onChipMemoryTotalKb} KB`}
        />

        <Gauge
          value={status.temperatureC}
          min={25}
          max={85}
          unit="°C"
          label="Die Temperature"
          color={status.temperatureC > 65 ? 'rose' : status.temperatureC > 50 ? 'amber' : 'blue'}
          sublabel="Thermal Limit: 85°C"
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
            <span className="font-bold text-[#172033] text-sm font-mono-tech">{status.clockFrequencyMhz} MHz</span>
            <span className="text-[10px] text-[#718096] block">Jitter: &lt; 0.05%</span>
          </div>
        </div>

        {/* Data Transfer */}
        <div className="p-3 rounded-lg bg-[#F8FAFC] border border-[#D9E2EC] flex items-center gap-2.5">
          <div className="p-2 rounded bg-white border border-slate-200 text-blue-600 shadow-2xs">
            <Radio className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] text-[#526174] uppercase font-medium block">SPI / DMA Transfer</span>
            <span className="font-bold text-blue-700 text-sm font-mono-tech">{status.dataTransferRateMBps} MB/s</span>
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
            <span className="font-bold text-[#172033] text-sm font-mono-tech">{status.powerEstimateWatts} W</span>
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
            <span className="font-bold text-[#172033] text-sm font-mono-tech">{status.onChipMemoryUsedKb} KB</span>
            <span className="text-[10px] text-[#718096] block">Cap: {status.onChipMemoryTotalKb} KB Total</span>
          </div>
        </div>
      </div>
    </div>
  );
};
