import React from 'react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend,
  CartesianGrid
} from 'recharts';
import { Clock, Zap, Activity, BatteryCharging } from 'lucide-react';
import { BenchmarkResult } from '../../types';

interface BenchmarkChartsProps {
  results: BenchmarkResult[];
}

export const BenchmarkCharts: React.FC<BenchmarkChartsProps> = ({ results }) => {
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-sans">
      {/* Chart 1: Latency */}
      <div className="bg-white rounded-xl p-4 border border-[#D9E2EC] shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-600" />
            <h4 className="font-bold text-xs text-[#172033] tracking-tight">
              1. Inference Latency (ms) — Lower is better
            </h4>
          </div>
          <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
            Up to 9.0x Speedup
          </span>
        </div>

        <div className="h-52 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={latencyData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="workload" stroke="#94A3B8" tick={{ fontSize: 10, fill: '#526174' }} />
              <YAxis stroke="#94A3B8" tick={{ fontSize: 10, fill: '#526174' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  borderColor: '#D9E2EC',
                  fontSize: '11px',
                  color: '#172033',
                  borderRadius: '6px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                }}
                formatter={(val, name) => [`${val} ms`, name === 'fpga' ? 'FPGA NCE' : 'CPU Baseline']}
              />
              <Legend wrapperStyle={{ fontSize: '10px' }} />
              <Bar dataKey="cpu" name="CPU Only" fill="#64748B" radius={[3, 3, 0, 0]} />
              <Bar dataKey="fpga" name="FPGA NCE" fill="#2563EB" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 2: Throughput */}
      <div className="bg-white rounded-xl p-4 border border-[#D9E2EC] shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-blue-600" />
            <h4 className="font-bold text-xs text-[#172033] tracking-tight">
              2. Throughput (FPS / Tokens/s) — Higher is better
            </h4>
          </div>
          <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-1.5 py-0.5 rounded">
            FPGA Dominant
          </span>
        </div>

        <div className="h-52 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={throughputData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="workload" stroke="#94A3B8" tick={{ fontSize: 10, fill: '#526174' }} />
              <YAxis stroke="#94A3B8" tick={{ fontSize: 10, fill: '#526174' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  borderColor: '#D9E2EC',
                  fontSize: '11px',
                  color: '#172033',
                  borderRadius: '6px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                }}
                formatter={(val, name) => [`${val} FPS/tok/s`, name === 'fpga' ? 'FPGA NCE' : 'CPU Baseline']}
              />
              <Legend wrapperStyle={{ fontSize: '10px' }} />
              <Bar dataKey="cpu" name="CPU Only" fill="#64748B" radius={[3, 3, 0, 0]} />
              <Bar dataKey="fpga" name="FPGA NCE" fill="#0B8FB3" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 3: CPU Utilization */}
      <div className="bg-white rounded-xl p-4 border border-[#D9E2EC] shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-blue-600" />
            <h4 className="font-bold text-xs text-[#172033] tracking-tight">
              3. Host RISC-V CPU Utilization (%)
            </h4>
          </div>
          <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
            Offloaded to FPGA
          </span>
        </div>

        <div className="h-52 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={cpuUtilData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="workload" stroke="#94A3B8" tick={{ fontSize: 10, fill: '#526174' }} />
              <YAxis stroke="#94A3B8" tick={{ fontSize: 10, fill: '#526174' }} domain={[0, 100]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  borderColor: '#D9E2EC',
                  fontSize: '11px',
                  color: '#172033',
                  borderRadius: '6px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                }}
                formatter={(val, name) => [`${val}%`, name === 'fpga' ? 'Host Load with FPGA' : 'Host Load (CPU Only)']}
              />
              <Legend wrapperStyle={{ fontSize: '10px' }} />
              <Bar dataKey="cpu" name="CPU Only Load" fill="#DC2626" radius={[3, 3, 0, 0]} />
              <Bar dataKey="fpga" name="FPGA Offload Load" fill="#2563EB" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 4: Energy per Inference */}
      <div className="bg-white rounded-xl p-4 border border-[#D9E2EC] shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <BatteryCharging className="w-4 h-4 text-blue-600" />
            <h4 className="font-bold text-xs text-[#172033] tracking-tight">
              4. Energy per Inference (Joules) — Lower is better
            </h4>
          </div>
          <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
            ~86% Energy Cut
          </span>
        </div>

        <div className="h-52 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={energyData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="workload" stroke="#94A3B8" tick={{ fontSize: 10, fill: '#526174' }} />
              <YAxis stroke="#94A3B8" tick={{ fontSize: 10, fill: '#526174' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  borderColor: '#D9E2EC',
                  fontSize: '11px',
                  color: '#172033',
                  borderRadius: '6px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                }}
                formatter={(val, name) => [`${val} Joules`, name === 'fpga' ? 'FPGA NCE' : 'CPU Baseline']}
              />
              <Legend wrapperStyle={{ fontSize: '10px' }} />
              <Bar dataKey="cpu" name="CPU Only" fill="#64748B" radius={[3, 3, 0, 0]} />
              <Bar dataKey="fpga" name="FPGA NCE" fill="#059669" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
