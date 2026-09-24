import React from 'react';
import { Download, Table } from 'lucide-react';
import { BenchmarkResult } from '../../types';
import { exportBenchmarksToCSV } from '../../services/benchmark';

interface BenchmarkTableProps {
  results: BenchmarkResult[];
}

export const BenchmarkTable: React.FC<BenchmarkTableProps> = ({ results }) => {
  return (
    <div className="bg-white rounded-xl p-5 border border-[#D9E2EC] shadow-xs space-y-4 font-sans">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Table className="w-4 h-4 text-blue-600" />
          <h3 className="font-bold text-[#172033] text-sm tracking-tight">
            Benchmark Results & Speedup Metrics Table
          </h3>
        </div>

        <button
          onClick={() => exportBenchmarksToCSV(results)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#D9E2EC] hover:bg-slate-50 text-[#172033] text-xs font-medium shadow-xs transition-colors cursor-pointer"
        >
          <Download className="w-3.5 h-3.5 text-blue-600" />
          <span>Export CSV</span>
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-[#D9E2EC] text-[11px] text-[#526174] font-semibold uppercase bg-[#F8FAFC]">
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
          <tbody className="divide-y divide-slate-100">
            {results.map((r) => {
              const isFpga = r.backend === 'fpga';
              return (
                <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-2.5 px-3 font-semibold text-[#172033]">
                    {r.workload}
                  </td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-semibold uppercase ${
                        isFpga
                          ? 'bg-blue-50 text-blue-800 border border-blue-200'
                          : 'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}
                    >
                      {r.backend.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-mono-tech text-[#172033]">
                    {r.latencyMs} ms
                  </td>
                  <td className="py-2.5 px-3 font-mono-tech text-blue-700">
                    {r.throughputFps} {r.workload === 'Tiny LLM' ? 'tok/s' : 'FPS'}
                  </td>
                  <td className="py-2.5 px-3 font-mono-tech text-slate-700">
                    {r.cpuUtilization}%
                  </td>
                  <td className="py-2.5 px-3 font-mono-tech text-blue-700">
                    {r.fpgaUtilization}%
                  </td>
                  <td className="py-2.5 px-3 font-mono-tech text-[#172033]">
                    {r.energyJoules} J
                  </td>
                  <td className="py-2.5 px-3">
                    {r.speedupFactor ? (
                      <span className="text-emerald-700 font-semibold font-mono-tech">
                        {r.speedupFactor}x
                      </span>
                    ) : (
                      <span className="text-[#718096]">1.0x (Baseline)</span>
                    )}
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    {r.energyEfficiencyGain ? (
                      <span className="text-emerald-700 font-semibold font-mono-tech">
                        -{r.energyEfficiencyGain}%
                      </span>
                    ) : (
                      <span className="text-[#718096]">Baseline</span>
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
