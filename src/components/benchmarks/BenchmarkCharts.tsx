import React from 'react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend 
} from 'recharts';
import { Clock, Zap, Activity, BatteryCharging } from 'lucide-react';
import { BenchmarkResult } from '../../types';

interface BenchmarkChartsProps {
  results: BenchmarkResult[];
}

export const BenchmarkCharts: React.FC<BenchmarkChartsProps> = ({ results }) => {
  // Group results by workload for charts
  const workloads = ['Object Detection', 'Matrix Multiplication', 'Convolution', 'Tiny LLM'] as const;

  const latencyData = workloads.map(w => {
    const cpuRes = results.find(r => r.workload === w && r.backend === 'cpu');
    const fpgaRes = results.find(r => r.workload === w && r.backend === 'fpga');
    return {
      workload: w.replace('Multiplication', 'MatMul'),
      cpu: cpuRes?.latencyMs || 0,
      fpga: fpgaRes?.latencyMs || 0,
    };
  });

  const throughputData = workloads.map(w => {
    const cpuRes = results.find(r => r.workload === w && r.backend === 'cpu');
    const fpgaRes = results.find(r => r.workload === w && r.backend === 'fpga');
    return {
      workload: w.replace('Multiplication', 'MatMul'),
      cpu: cpuRes?.throughputFps || 0,
      fpga: fpgaRes?.throughputFps || 0,
    };
  });

  const cpuUtilData = workloads.map(w => {
    const cpuRes = results.find(r => r.workload === w && r.backend === 'cpu');
    const fpgaRes = results.find(r => r.workload === w && r.backend === 'fpga');
    return {
      workload: w.replace('Multiplication', 'MatMul'),
      cpu: cpuRes?.cpuUtilization || 0,
      fpga: fpgaRes?.cpuUtilization || 0,
    };
  });

  const energyData = workloads.map(w => {
    const cpuRes = results.find(r => r.workload === w && r.backend === 'cpu');
    const fpgaRes = results.find(r => r.workload === w && r.backend === 'fpga');
    return {
      workload: w.replace('Multiplication', 'MatMul'),
      cpu: cpuRes?.energyJoules || 0,
      fpga: fpgaRes?.energyJoules || 0,
    };
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Chart 1: Latency */}
      <div className="tech-card rounded-xl p-4 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-cyan-400" />
            <h4 className="font-bold text-xs font-mono-tech text-slate-100 uppercase tracking-wider">
              1. INFERENCE LATENCY (ms) — LOWER IS BETTER
            </h4>
          </div>
          <span className="text-[10px] font-mono-tech text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-1.5 py-0.5 rounded">
            UP TO 9.0x SPEEDUP
          </span>
        </div>

        <div className="h-52 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={latencyData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <XAxis dataKey="workload" stroke="#64748b" tick={{ fontSize: 10, fill: '#94a3b8' }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 10, fill: '#94a3b8' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#090d16',
                  borderColor: '#1e293b',
                  fontSize: '11px',
                  fontFamily: 'monospace',
                }}
                formatter={(val, name) => [`${val} ms`, name === 'fpga' ? 'FPGA NCE' : 'CPU Baseline']}
              />
              <Legend wrapperStyle={{ fontSize: '10px', fontFamily: 'monospace' }} />
              <Bar dataKey="cpu" name="CPU Only" fill="#f59e0b" radius={[3, 3, 0, 0]} />
              <Bar dataKey="fpga" name="FPGA NCE" fill="#10b981" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 2: Throughput */}
      <div className="tech-card rounded-xl p-4 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-400" />
            <h4 className="font-bold text-xs font-mono-tech text-slate-100 uppercase tracking-wider">
              2. THROUGHPUT (FPS / TOKENS/S) — HIGHER IS BETTER
            </h4>
          </div>
          <span className="text-[10px] font-mono-tech text-cyan-400 bg-cyan-950/60 border border-cyan-800/40 px-1.5 py-0.5 rounded">
            FPGA DOMINANT
          </span>
        </div>

        <div className="h-52 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={throughputData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <XAxis dataKey="workload" stroke="#64748b" tick={{ fontSize: 10, fill: '#94a3b8' }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 10, fill: '#94a3b8' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#090d16',
                  borderColor: '#1e293b',
                  fontSize: '11px',
                  fontFamily: 'monospace',
                }}
                formatter={(val, name) => [`${val} FPS/tok/s`, name === 'fpga' ? 'FPGA NCE' : 'CPU Baseline']}
              />
              <Legend wrapperStyle={{ fontSize: '10px', fontFamily: 'monospace' }} />
              <Bar dataKey="cpu" name="CPU Only" fill="#f59e0b" radius={[3, 3, 0, 0]} />
              <Bar dataKey="fpga" name="FPGA NCE" fill="#00f0ff" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 3: CPU Utilization */}
      <div className="tech-card rounded-xl p-4 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <h4 className="font-bold text-xs font-mono-tech text-slate-100 uppercase tracking-wider">
              3. HOST RISC-V CPU UTILIZATION (%)
            </h4>
          </div>
          <span className="text-[10px] font-mono-tech text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-1.5 py-0.5 rounded">
            OFFLOADED TO FPGA
          </span>
        </div>

        <div className="h-52 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={cpuUtilData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <XAxis dataKey="workload" stroke="#64748b" tick={{ fontSize: 10, fill: '#94a3b8' }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 10, fill: '#94a3b8' }} domain={[0, 100]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#090d16',
                  borderColor: '#1e293b',
                  fontSize: '11px',
                  fontFamily: 'monospace',
                }}
                formatter={(val, name) => [`${val}%`, name === 'fpga' ? 'Host Load with FPGA' : 'Host Load (CPU Only)']}
              />
              <Legend wrapperStyle={{ fontSize: '10px', fontFamily: 'monospace' }} />
              <Bar dataKey="cpu" name="CPU Only Load" fill="#f43f5e" radius={[3, 3, 0, 0]} />
              <Bar dataKey="fpga" name="FPGA Offload Load" fill="#38bdf8" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 4: Energy per Inference */}
      <div className="tech-card rounded-xl p-4 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <BatteryCharging className="w-4 h-4 text-purple-400" />
            <h4 className="font-bold text-xs font-mono-tech text-slate-100 uppercase tracking-wider">
              4. ENERGY PER INFERENCE (JOULES) — LOWER IS BETTER
            </h4>
          </div>
          <span className="text-[10px] font-mono-tech text-purple-400 bg-purple-950/60 border border-purple-800/40 px-1.5 py-0.5 rounded">
            ~86% ENERGY SAVED
          </span>
        </div>

        <div className="h-52 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={energyData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <XAxis dataKey="workload" stroke="#64748b" tick={{ fontSize: 10, fill: '#94a3b8' }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 10, fill: '#94a3b8' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#090d16',
                  borderColor: '#1e293b',
                  fontSize: '11px',
                  fontFamily: 'monospace',
                }}
                formatter={(val, name) => [`${val} Joules`, name === 'fpga' ? 'FPGA NCE' : 'CPU Baseline']}
              />
              <Legend wrapperStyle={{ fontSize: '10px', fontFamily: 'monospace' }} />
              <Bar dataKey="cpu" name="CPU Only" fill="#f59e0b" radius={[3, 3, 0, 0]} />
              <Bar dataKey="fpga" name="FPGA NCE" fill="#a855f7" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
