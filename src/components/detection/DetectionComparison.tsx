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
    <div className="tech-card rounded-xl p-5 border border-slate-800 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-cyan-400" />
          <h3 className="font-bold text-slate-100 text-sm font-mono-tech tracking-wider">
            OBJECT DETECTION: CPU vs FPGA ACCELERATION COMPARISON
          </h3>
        </div>
        <span className="text-[10px] font-mono-tech text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded">
          7.7x SPEEDUP | 85.8% ENERGY CUT
        </span>
      </div>

      <div className="h-60 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={comparisonData}
            margin={{ top: 20, right: 30, left: 10, bottom: 5 }}
          >
            <XAxis dataKey="metric" stroke="#64748b" tick={{ fontSize: 11, fill: '#94a3b8' }} />
            <YAxis stroke="#64748b" tick={{ fontSize: 11, fill: '#94a3b8' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#090d16',
                borderColor: '#1e293b',
                fontSize: '12px',
                fontFamily: 'monospace',
                borderRadius: '8px',
              }}
              formatter={(value, name) => [
                `${value} `,
                name === 'fpga' ? 'FPGA Accelerated (NCE)' : 'CPU Only (RISC-V)'
              ]}
            />
            <Legend
              wrapperStyle={{ fontSize: '11px', fontFamily: 'monospace', paddingTop: '10px' }}
              formatter={(val) => (val === 'fpga' ? 'FPGA Accelerated (NCE)' : 'CPU Baseline (RISC-V)')}
            />
            <Bar dataKey="cpu" fill="#f59e0b" radius={[4, 4, 0, 0]} name="cpu" />
            <Bar dataKey="fpga" fill="#10b981" radius={[4, 4, 0, 0]} name="fpga" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-800 font-mono-tech text-xs">
        <div className="p-2 rounded bg-slate-900/60 border border-slate-800">
          <span className="text-[10px] text-slate-400 block">Latency Delta</span>
          <span className="font-bold text-emerald-400 text-sm">18.4 vs 142.6 ms</span>
          <span className="text-[10px] text-slate-400 block mt-0.5">87% Latency Reduction</span>
        </div>
        <div className="p-2 rounded bg-slate-900/60 border border-slate-800">
          <span className="text-[10px] text-slate-400 block">FPS Multiplier</span>
          <span className="font-bold text-emerald-400 text-sm">54.3 vs 7.0 FPS</span>
          <span className="text-[10px] text-slate-400 block mt-0.5">7.75x Higher Throughput</span>
        </div>
        <div className="p-2 rounded bg-slate-900/60 border border-slate-800">
          <span className="text-[10px] text-slate-400 block">Host CPU Relief</span>
          <span className="font-bold text-emerald-400 text-sm">29.1% vs 94.2%</span>
          <span className="text-[10px] text-slate-400 block mt-0.5">Host Available for OS</span>
        </div>
        <div className="p-2 rounded bg-slate-900/60 border border-slate-800">
          <span className="text-[10px] text-slate-400 block">Energy Consumption</span>
          <span className="font-bold text-emerald-400 text-sm">0.088 vs 0.620 J</span>
          <span className="text-[10px] text-slate-400 block mt-0.5">85.8% Less Battery Draw</span>
        </div>
      </div>
    </div>
  );
};
