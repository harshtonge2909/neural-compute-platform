import React from 'react';
import { Gauge } from '../common/Gauge';
import { NCEStatus } from '../../types';
import { Cpu, Zap, HardDrive, Radio, Activity, Thermometer, BatteryCharging } from 'lucide-react';

interface HardwareGaugesProps {
  status: NCEStatus;
}

export const HardwareGauges: React.FC<HardwareGaugesProps> = ({ status }) => {
  return (
    <div className="tech-card rounded-xl p-5 border border-slate-800 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyan-400" />
          <h3 className="font-bold text-slate-100 text-sm font-mono-tech tracking-wider">
            HARDWARE TELEMETRY & PHYSICAL METRICS
          </h3>
        </div>
        <span className="text-[10px] font-mono-tech text-cyan-400 bg-cyan-950/60 border border-cyan-800/40 px-2 py-0.5 rounded">
          SENSORS ONLINE
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
          color="cyan"
          sublabel="NCE Core"
        />

        <Gauge
          value={status.macUtilization}
          min={0}
          max={100}
          unit="%"
          label="Systolic MAC Array"
          color="emerald"
          sublabel="64x64 Grid"
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
          color={status.temperatureC > 65 ? 'rose' : status.temperatureC > 50 ? 'amber' : 'emerald'}
          sublabel="Thermal Limit: 85°C"
        />
      </div>

      {/* Hardware Telemetry Stat Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 font-mono-tech text-xs">
        {/* Clock */}
        <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center gap-2.5">
          <div className="p-2 rounded bg-slate-800/80 text-cyan-400">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block uppercase">Clock Frequency</span>
            <span className="font-bold text-slate-100 text-sm">{status.clockFrequencyMhz} MHz</span>
            <span className="text-[9px] text-slate-400 block">Jitter: &lt; 0.05%</span>
          </div>
        </div>

        {/* Data Transfer */}
        <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center gap-2.5">
          <div className="p-2 rounded bg-slate-800/80 text-purple-400">
            <Radio className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block uppercase">SPI / DMA Transfer</span>
            <span className="font-bold text-purple-300 text-sm">{status.dataTransferRateMBps} MB/s</span>
            <span className="text-[9px] text-slate-400 block">Peak: 50.0 MB/s</span>
          </div>
        </div>

        {/* Power Estimate */}
        <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center gap-2.5">
          <div className="p-2 rounded bg-slate-800/80 text-emerald-400">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block uppercase">Board Power</span>
            <span className="font-bold text-emerald-300 text-sm">{status.powerEstimateWatts} W</span>
            <span className="text-[9px] text-slate-400 block">VCC: 1.0V Core / 3.3V I/O</span>
          </div>
        </div>

        {/* SRAM Capacity */}
        <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center gap-2.5">
          <div className="p-2 rounded bg-slate-800/80 text-amber-400">
            <HardDrive className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block uppercase">On-Chip BRAM</span>
            <span className="font-bold text-slate-100 text-sm">{status.onChipMemoryUsedKb} KB</span>
            <span className="text-[9px] text-slate-400 block">Cap: {status.onChipMemoryTotalKb} KB Total</span>
          </div>
        </div>
      </div>
    </div>
  );
};
