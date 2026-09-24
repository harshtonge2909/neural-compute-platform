import React, { useState } from 'react';
import { useSystem } from '../context/SystemContext';
import { BENCHMARK_HISTORY } from '../data/mockData';
import { BenchmarkResult, WorkloadType, BackendTarget } from '../types';
import { getBackend } from '../services/api';
import { BenchmarkRunner } from '../components/benchmarks/BenchmarkRunner';
import { BenchmarkCharts } from '../components/benchmarks/BenchmarkCharts';
import { BenchmarkTable } from '../components/benchmarks/BenchmarkTable';
import { RuntimeLog } from '../components/common/RuntimeLog';

export const Benchmarks: React.FC = () => {
  const { hardwareMode, addLog, triggerNCEPulse, setIsInferring } = useSystem();

  const [results, setResults] = useState<BenchmarkResult[]>(BENCHMARK_HISTORY);
  const [selectedWorkload, setSelectedWorkload] = useState<WorkloadType>('Object Detection');
  const [selectedBackend, setSelectedBackend] = useState<BackendTarget | 'both'>('both');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [currentMessage, setCurrentMessage] = useState<string>('');

  const handleRunBenchmark = async () => {
    setIsRunning(true);
    setIsInferring(true);
    setProgressPercent(10);
    setCurrentMessage(`Initiating benchmark suite for ${selectedWorkload}...`);

    addLog('RUNTIME', 'INFO', `Benchmark run started: Workload=${selectedWorkload}, Backend=${selectedBackend.toUpperCase()}`);

    try {
      const api = getBackend(hardwareMode);

      if (selectedBackend === 'both') {
        // Run CPU first
        setCurrentMessage(`Benchmarking CPU baseline for ${selectedWorkload}...`);
        const cpuRes = await api.runBenchmark(
          { workload: selectedWorkload, backend: 'cpu' },
          (pct: number, msg: string) => {
            setProgressPercent(Math.round(pct / 2));
            setCurrentMessage(`[CPU] ${msg}`);
          }
        );

        // Run FPGA second
        setCurrentMessage(`Benchmarking FPGA accelerator for ${selectedWorkload}...`);
        triggerNCEPulse(['controller', 'on_chip_memory', 'mac_array', 'matrix_engine', 'conv_unit']);
        const fpgaRes = await api.runBenchmark(
          { workload: selectedWorkload, backend: 'fpga' },
          (pct: number, msg: string) => {
            setProgressPercent(50 + Math.round(pct / 2));
            setCurrentMessage(`[FPGA] ${msg}`);
          }
        );

        setResults(prev => {
          const filtered = prev.filter(r => !(r.workload === selectedWorkload));
          return [...filtered, cpuRes, fpgaRes];
        });

        addLog('PERF', 'PERF', `Benchmark completed: ${selectedWorkload} CPU Latency=${cpuRes.latencyMs}ms vs FPGA Latency=${fpgaRes.latencyMs}ms (${fpgaRes.speedupFactor}x Speedup)`);
      } else {
        // Single backend run
        if (selectedBackend === 'fpga') {
          triggerNCEPulse();
        }
        const singleRes = await api.runBenchmark(
          { workload: selectedWorkload, backend: selectedBackend },
          (pct: number, msg: string) => {
            setProgressPercent(pct);
            setCurrentMessage(msg);
          }
        );

        setResults(prev => {
          const filtered = prev.filter(r => !(r.workload === selectedWorkload && r.backend === selectedBackend));
          return [...filtered, singleRes];
        });

        addLog('PERF', 'PERF', `Benchmark completed: ${selectedWorkload} on ${selectedBackend.toUpperCase()}: Latency=${singleRes.latencyMs}ms, FPS=${singleRes.throughputFps}`);
      }
    } catch (err: any) {
      addLog('RUNTIME', 'ERROR', `Benchmark error: ${err.message}`);
    } finally {
      setIsRunning(false);
      setIsInferring(false);
      setProgressPercent(0);
      setCurrentMessage('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-100 font-mono-tech tracking-tight">
              PERFORMANCE BENCHMARK
            </h1>
            <span className="text-xs px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 font-mono-tech font-bold">
              EMPIRICAL VALIDATION
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Comparative Evaluation: CPU-Only Baseline vs CPU + FPGA Accelerated Execution
          </p>
        </div>

        <div className="text-xs font-mono-tech text-slate-400">
          Target Platform: <strong className="text-slate-200">Milk-V Mars + NCE</strong>
        </div>
      </div>

      {/* Benchmark Execution Controls */}
      <BenchmarkRunner
        workload={selectedWorkload}
        onSelectWorkload={setSelectedWorkload}
        backend={selectedBackend}
        onSelectBackend={setSelectedBackend}
        onRunBenchmark={handleRunBenchmark}
        isRunning={isRunning}
        progressPercent={progressPercent}
        currentMessage={currentMessage}
      />

      {/* 4 Comparative Recharts */}
      <BenchmarkCharts results={results} />

      {/* Detailed Results Table with CSV Export */}
      <BenchmarkTable results={results} />

      {/* Embedded Terminal Log */}
      <RuntimeLog maxHeight="max-h-44" title="Benchmark Profiler Log" />
    </div>
  );
};
