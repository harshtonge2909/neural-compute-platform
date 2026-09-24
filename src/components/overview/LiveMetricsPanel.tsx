import React, { useState, useEffect } from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip,
  CartesianGrid
} from 'recharts';
import { Activity, Zap } from 'lucide-react';
import { useSystem } from '../../context/SystemContext';

interface ChartPoint {
  time: string;
  latency: number;
  fps: number;
  cpu: number;
  fpga: number;
}

export const LiveMetricsPanel: React.FC = () => {
  const { nceStatus, isInferring } = useSystem();
  const [data, setData] = useState<ChartPoint[]>([]);

  useEffect(() => {
    const initial: ChartPoint[] = [];
    const now = Date.now();
    for (let i = 12; i >= 0; i--) {
      const d = new Date(now - i * 1500);
      initial.push({
        time: d.toTimeString().split(' ')[0].slice(3, 8),
        latency: +(18.0 + (Math.random() - 0.5) * 1.5).toFixed(1),
        fps: +(54.0 + (Math.random() - 0.5) * 2.0).toFixed(1),
        cpu: Math.round(29 + (Math.random() - 0.5) * 4),
        fpga: Math.round(79 + (Math.random() - 0.5) * 6),
      });
    }
    setData(initial);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setData((prev) => {
        const now = new Date();
        const timeStr = now.toTimeString().split(' ')[0].slice(3, 8);
        const latJitter = isInferring 
          ? +(17.8 + (Math.random() - 0.5) * 1.0).toFixed(1) 
          : +(18.4 + (Math.random() - 0.5) * 1.8).toFixed(1);
        const fpsJitter = +(1000 / latJitter).toFixed(1);

        const newPoint: ChartPoint = {
          time: timeStr,
          latency: latJitter,
          fps: fpsJitter,
          cpu: Math.round(isInferring ? 32 + Math.random() * 4 : 26 + Math.random() * 5),
          fpga: nceStatus.acceleratorUtilization,
        };

        const updated = [...prev.slice(1), newPoint];
        return updated;
      });
    }, 1500);

    return () => clearInterval(interval);
  }, [isInferring, nceStatus.acceleratorUtilization]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Chart 1: Inference Latency & FPS */}
      <div className="bg-white rounded-xl p-4 border border-[#D9E2EC] shadow-xs">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-blue-600" />
            <span className="font-semibold text-[#172033] text-xs font-sans">
              Real-Time Latency (ms) & Throughput (FPS)
            </span>
          </div>
          <span className="text-[10px] font-sans font-medium text-blue-700 px-1.5 py-0.5 rounded bg-blue-50 border border-blue-200">
            FPGA Stream
          </span>
        </div>

        <div className="h-44 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="latencyGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563EB" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#2563EB" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="time" stroke="#94A3B8" tick={{ fontSize: 10, fill: '#64748B' }} />
              <YAxis stroke="#94A3B8" tick={{ fontSize: 10, fill: '#64748B' }} domain={[10, 30]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  borderColor: '#D9E2EC',
                  fontSize: '11px',
                  fontFamily: 'sans-serif',
                  color: '#172033',
                  borderRadius: '6px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                }}
              />
              <Area
                type="monotone"
                dataKey="latency"
                name="Latency (ms)"
                stroke="#2563EB"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#latencyGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center justify-between text-[11px] font-sans text-[#526174] mt-2 px-1">
          <span>Avg Latency: <strong className="text-blue-700 font-mono-tech">18.4 ms</strong></span>
          <span>Avg Throughput: <strong className="text-emerald-700 font-mono-tech">54.3 FPS</strong></span>
        </div>
      </div>

      {/* Chart 2: CPU vs FPGA Utilization */}
      <div className="bg-white rounded-xl p-4 border border-[#D9E2EC] shadow-xs">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-blue-600" />
            <span className="font-semibold text-[#172033] text-xs font-sans">
              Hardware Load: RISC-V CPU vs FPGA NCE (%)
            </span>
          </div>
          <span className="text-[10px] font-sans font-medium text-blue-700 px-1.5 py-0.5 rounded bg-blue-50 border border-blue-200">
            Systolic Offload
          </span>
        </div>

        <div className="h-44 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="fpgaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563EB" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#2563EB" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="cpuGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#64748B" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#64748B" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="time" stroke="#94A3B8" tick={{ fontSize: 10, fill: '#64748B' }} />
              <YAxis stroke="#94A3B8" tick={{ fontSize: 10, fill: '#64748B' }} domain={[0, 100]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  borderColor: '#D9E2EC',
                  fontSize: '11px',
                  fontFamily: 'sans-serif',
                  color: '#172033',
                  borderRadius: '6px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                }}
              />
              <Area
                type="monotone"
                dataKey="fpga"
                name="FPGA Util (%)"
                stroke="#2563EB"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#fpgaGrad)"
              />
              <Area
                type="monotone"
                dataKey="cpu"
                name="CPU Util (%)"
                stroke="#64748B"
                strokeWidth={1.5}
                strokeDasharray="3 3"
                fillOpacity={1}
                fill="url(#cpuGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center justify-between text-[11px] font-sans text-[#526174] mt-2 px-1">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-600" />
            FPGA NCE: <strong className="text-[#172033] font-mono-tech">{nceStatus.acceleratorUtilization}%</strong>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-slate-500" />
            RISC-V CPU: <strong className="text-[#172033] font-mono-tech">29%</strong>
          </span>
        </div>
      </div>
    </div>
  );
};
