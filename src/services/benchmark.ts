import { BenchmarkResult } from '../types';

export function exportBenchmarksToCSV(results: BenchmarkResult[]): void {
  const headers = [
    'Benchmark ID',
    'Timestamp',
    'Workload',
    'Backend',
    'Latency (ms)',
    'Throughput (FPS / Tok/s)',
    'CPU Utilization (%)',
    'FPGA Utilization (%)',
    'Energy per Inference (J)',
    'Power (W)',
    'Speedup vs CPU',
    'Energy Efficiency Gain (%)',
    'Mode'
  ];

  const rows = results.map(r => [
    r.id,
    r.timestamp,
    `"${r.workload}"`,
    r.backend.toUpperCase(),
    r.latencyMs,
    r.throughputFps,
    r.cpuUtilization,
    r.fpgaUtilization,
    r.energyJoules,
    r.powerWatts,
    r.speedupFactor ? `${r.speedupFactor}x` : '1.0x (Baseline)',
    r.energyEfficiencyGain ? `${r.energyEfficiencyGain}%` : 'Baseline',
    r.isSimulated ? 'SIMULATED' : 'HARDWARE'
  ]);

  const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `NCA_Benchmark_Report_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
