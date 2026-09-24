import React from 'react';
import { 
  Clock, 
  Activity, 
  Cpu, 
  Zap, 
  BatteryCharging, 
  ArrowRight,
} from 'lucide-react';
import { useSystem } from '../context/SystemContext';
import { MetricCard } from '../components/common/MetricCard';
import { PipelineVisualization } from '../components/overview/PipelineVisualization';
import { SystemStatusCard } from '../components/overview/SystemStatusCard';
import { LiveMetricsPanel } from '../components/overview/LiveMetricsPanel';
import { RuntimeLog } from '../components/common/RuntimeLog';

export const Overview: React.FC = () => {
  const { nceStatus, setActivePage, hardwareMode } = useSystem();

  return (
    <div className="space-y-6">
      {/* Page Title & Subtitle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#D9E2EC]">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-bold text-[#172033] font-sans tracking-tight">
              Neural Compute Platform
            </h1>
            <span className="text-xs px-2 py-0.5 rounded bg-blue-50 border border-blue-200 text-blue-700 font-sans font-medium">
              StarFive JH7110 + NCE
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#526174] mt-1 font-sans">
            RISC-V + FPGA Accelerated Edge AI Computing Architecture
          </p>
        </div>

        {/* Quick Launch Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setActivePage('detection')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-sans text-xs font-semibold transition-all shadow-xs cursor-pointer"
          >
            <span>Launch Object Detection</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setActivePage('llm')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white hover:bg-slate-50 text-[#172033] font-sans text-xs font-semibold transition-colors border border-[#D9E2EC] shadow-xs cursor-pointer"
          >
            <span>Launch Tiny LLM</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 6 Key Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <MetricCard
          title="Inference Latency"
          value="18.4"
          unit="ms"
          icon={<Clock className="w-4 h-4 text-blue-600" />}
          trend={{ value: '↓ 87.1%', direction: 'down', isPositive: true }}
          subtitle="vs 142.6 ms CPU"
          isSimulated={hardwareMode === 'simulation'}
        />

        <MetricCard
          title="Throughput"
          value="54.3"
          unit="FPS"
          icon={<Activity className="w-4 h-4 text-blue-600" />}
          trend={{ value: '↑ 7.7x', direction: 'up', isPositive: true }}
          subtitle="Real-time target"
          isSimulated={hardwareMode === 'simulation'}
        />

        <MetricCard
          title="CPU Utilization"
          value="29"
          unit="%"
          icon={<Cpu className="w-4 h-4 text-blue-600" />}
          trend={{ value: '↓ 65.1%', direction: 'down', isPositive: true }}
          subtitle="Host CPU relief"
          isSimulated={hardwareMode === 'simulation'}
        />

        <MetricCard
          title="FPGA Utilization"
          value={nceStatus.acceleratorUtilization}
          unit="%"
          icon={<Zap className="w-4 h-4 text-blue-600" />}
          trend={{ value: 'Optimal', direction: 'neutral' }}
          subtitle="64×64 Systolic Array"
          isSimulated={hardwareMode === 'simulation'}
        />

        <MetricCard
          title="Board Power"
          value={nceStatus.powerEstimateWatts}
          unit="W"
          icon={<Zap className="w-4 h-4 text-blue-600" />}
          trend={{ value: '↓ 62%', direction: 'down', isPositive: true }}
          subtitle="Host + FPGA power"
          isSimulated={hardwareMode === 'simulation'}
        />

        <MetricCard
          title="Energy / Inference"
          value="0.088"
          unit="J"
          icon={<BatteryCharging className="w-4 h-4 text-blue-600" />}
          trend={{ value: '↓ 85.8%', direction: 'down', isPositive: true }}
          subtitle="0.620 J CPU baseline"
          isSimulated={hardwareMode === 'simulation'}
        />
      </div>

      {/* Accelerator Pipeline Horizontal Dataflow Visualization */}
      <PipelineVisualization />

      {/* Two-Column Grid: Hardware Status Card & Live Metrics Panel */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-1">
          <SystemStatusCard />
        </div>
        <div className="xl:col-span-2">
          <LiveMetricsPanel />
        </div>
      </div>

      {/* Runtime Log Terminal */}
      <div>
        <RuntimeLog maxHeight="max-h-56" title="System Runtime & Kernel Event Log" />
      </div>
    </div>
  );
};
