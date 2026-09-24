import React from 'react';
import { Download, Table, CheckCircle2 } from 'lucide-react';
import { BenchmarkResult } from '../../types';
import { exportBenchmarksToCSV } from '../../services/benchmark';

interface BenchmarkTableProps {
  results: BenchmarkResult[];
}

export const BenchmarkTable: React.FC<BenchmarkTableProps> = ({ results }) => {
  return (
    <div className="tech-card rounded-xl p-5 border border-slate-800 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <Table className="w-4 h-4 text-cyan-400" />
          <h3 className="font-bold text-slate-100 text-sm font-mono-tech tracking-wider">
            BENCHMARK RESULTS & SPEEDUP METRICS TABLE
          </h3>
        </div>

        <button
          onClick={() => exportBenchmarksToCSV(results)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700/80 hover:border-cyan-500 text-slate-200 hover:text-cyan-300 font-mono-tech text-xs transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export CSV</span>
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left font-mono-tech text-xs">
          <thead>
            <tr className="border-b border-slate-800 text-[11px] text-slate-400 uppercase">
              <th className="py-2.5 px-3">Workload</th>
              <th className="py-2.5 px-3">Backend</th>
              <th className="py-2.5 px-3">Latency</th>
              <th className="py-2.5 px-3">Throughput</th>
              <th className="py-2.5 px-3">CPU Util</th>
              <th className="py-2.5 px-3">FPGA Util</th>
              <th className="py-2.5 px-3">Energy / Inf</th>
              <th className="py-2.5 px-3">Speedup vs CPU</th>
              <th className="py-2.5 px-3 text-right">Energy Saved</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {results.map((r) => {
              const isFpga = r.backend === 'fpga';
              return (
                <tr key={r.id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="py-2.5 px-3 font-bold text-slate-200">
                    {r.workload}
                  </td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        isFpga
                          ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/50'
                          : 'bg-amber-950/80 text-amber-400 border border-amber-500/50'
                      }`}
                    >
                      {r.backend.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-semibold text-slate-200">
                    {r.latencyMs} ms
                  </td>
                  <td className="py-2.5 px-3 text-cyan-300">
                    {r.throughputFps} {r.workload === 'Tiny LLM' ? 'tok/s' : 'FPS'}
                  </td>
                  <td className="py-2.5 px-3 text-amber-300">
                    {r.cpuUtilization}%
                  </td>
                  <td className="py-2.5 px-3 text-emerald-300">
                    {r.fpgaUtilization}%
                  </td>
                  <td className="py-2.5 px-3 text-purple-300">
                    {r.energyJoules} J
                  </td>
                  <td className="py-2.5 px-3">
                    {r.speedupFactor ? (
                      <span className="text-emerald-400 font-bold">
                        {r.speedupFactor}x
                      </span>
                    ) : (
                      <span className="text-slate-400">1.0x (Baseline)</span>
                    )}
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    {r.energyEfficiencyGain ? (
                      <span className="text-emerald-400 font-bold">
                        -{r.energyEfficiencyGain}%
                      </span>
                    ) : (
                      <span className="text-slate-400">Baseline</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
