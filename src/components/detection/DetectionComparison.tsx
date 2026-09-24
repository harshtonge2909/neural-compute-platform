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
import { BarChart3 } from 'lucide-react';

interface ComparisonData {
  metric: string;
  cpu: number;
  fpga: number;
  unit: string;
  higherIsBetter?: boolean;
}

export const DetectionComparison: React.FC = () => {
  const comparisonData: ComparisonData[] = [
    { metric: 'Latency (Lower is better)', cpu: 142.6, fpga: 18.4, unit: 'ms', higherIsBetter: false },
    { metric: 'Throughput (FPS)', cpu: 7.0, fpga: 54.3, unit: 'FPS', higherIsBetter: true },
    { metric: 'CPU Utilization (%)', cpu: 94.2, fpga: 29.1, unit: '%', higherIsBetter: false },
    { metric: 'Energy / Frame (x10 J)', cpu: 6.20, fpga: 0.88, unit: '0.1J', higherIsBetter: false },
  ];

  return (
    <div className="bg-white rounded-xl p-5 border border-[#D9E2EC] shadow-xs space-y-4 font-sans">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-blue-600" />
          <h3 className="font-bold text-[#172033] text-sm tracking-tight">
            Object Detection: CPU vs FPGA Acceleration Comparison
          </h3>
        </div>
        <span className="text-[11px] font-sans font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
          7.7x Speedup | 85.8% Energy Reduction
        </span>
      </div>

      <div className="h-60 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={comparisonData}
            margin={{ top: 20, right: 30, left: 10, bottom: 5 }}
          >
            <CartesianGrid stroke="#F1F5F9" vertical={false} />
            <XAxis dataKey="metric" stroke="#94A3B8" tick={{ fontSize: 11, fill: '#526174' }} />
            <YAxis stroke="#94A3B8" tick={{ fontSize: 11, fill: '#526174' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#FFFFFF',
                borderColor: '#D9E2EC',
                fontSize: '11px',
                color: '#172033',
                borderRadius: '6px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              }}
              formatter={(value, name) => [
                `${value} `,
                name === 'fpga' ? 'FPGA Accelerated (NCE)' : 'CPU Only (RISC-V)'
              ]}
            />
            <Legend
              wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
              formatter={(val) => (val === 'fpga' ? 'FPGA Accelerated (NCE)' : 'CPU Baseline (RISC-V)')}
            />
            <Bar dataKey="cpu" fill="#64748B" radius={[4, 4, 0, 0]} name="cpu" />
            <Bar dataKey="fpga" fill="#2563EB" radius={[4, 4, 0, 0]} name="fpga" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-100 text-xs">
        <div className="p-3 rounded-lg bg-[#F8FAFC] border border-[#D9E2EC]">
          <span className="text-[11px] text-[#526174] block">Latency Delta</span>
          <span className="font-bold text-emerald-700 text-sm font-mono-tech mt-0.5 block">18.4 vs 142.6 ms</span>
          <span className="text-[11px] text-[#718096] block mt-0.5">87% Latency Reduction</span>
        </div>
        <div className="p-3 rounded-lg bg-[#F8FAFC] border border-[#D9E2EC]">
          <span className="text-[11px] text-[#526174] block">FPS Multiplier</span>
          <span className="font-bold text-emerald-700 text-sm font-mono-tech mt-0.5 block">54.3 vs 7.0 FPS</span>
          <span className="text-[11px] text-[#718096] block mt-0.5">7.75x Higher Throughput</span>
        </div>
        <div className="p-3 rounded-lg bg-[#F8FAFC] border border-[#D9E2EC]">
          <span className="text-[11px] text-[#526174] block">Host CPU Relief</span>
          <span className="font-bold text-emerald-700 text-sm font-mono-tech mt-0.5 block">29.1% vs 94.2%</span>
          <span className="text-[11px] text-[#718096] block mt-0.5">Host Available for OS</span>
        </div>
        <div className="p-3 rounded-lg bg-[#F8FAFC] border border-[#D9E2EC]">
          <span className="text-[11px] text-[#526174] block">Energy Consumption</span>
          <span className="font-bold text-emerald-700 text-sm font-mono-tech mt-0.5 block">0.088 vs 0.620 J</span>
          <span className="text-[11px] text-[#718096] block mt-0.5">85.8% Less Energy</span>
        </div>
      </div>
    </div>
  );
};
