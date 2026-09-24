import React, { useState, useRef, useEffect } from 'react';
import { Terminal, Trash2, Download, Filter, ArrowDown } from 'lucide-react';
import { LogEntry } from '../../types';
import { useSystem } from '../../context/SystemContext';

interface RuntimeLogProps {
  maxHeight?: string;
  title?: string;
  collapsible?: boolean;
}

export const RuntimeLog: React.FC<RuntimeLogProps> = ({
  maxHeight = 'max-h-72',
  title = 'System Runtime Log',
}) => {
  const { logs, clearLogs } = useSystem();
  const [filterModule, setFilterModule] = useState<string>('ALL');
  const [autoScroll, setAutoScroll] = useState<boolean>(true);
  const logContainerRef = useRef<HTMLDivElement>(null);

  const filteredLogs = filterModule === 'ALL' 
    ? logs 
    : logs.filter(l => l.module === filterModule);

  useEffect(() => {
    if (autoScroll && logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs, autoScroll]);

  const downloadLogs = () => {
    const text = logs
      .map(l => `[${l.timestamp}] [${l.module}] [${l.level}] ${l.message}`)
      .join('\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nca_runtime_log_${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getLevelStyle = (level: LogEntry['level']) => {
    switch (level) {
      case 'NCE':
        return 'text-cyan-400 bg-cyan-950/60 border-cyan-800/40';
      case 'PERF':
        return 'text-emerald-400 bg-emerald-950/60 border-emerald-800/40';
      case 'WARN':
        return 'text-amber-400 bg-amber-950/60 border-amber-800/40';
      case 'ERROR':
        return 'text-rose-400 bg-rose-950/60 border-rose-800/40';
      default:
        return 'text-sky-300 bg-sky-950/50 border-sky-800/30';
    }
  };

  const getModuleStyle = (module: LogEntry['module']) => {
    switch (module) {
      case 'FPGA':
        return 'text-emerald-400';
      case 'COMM':
        return 'text-purple-400';
      case 'RUNTIME':
        return 'text-cyan-400';
      case 'HOST':
        return 'text-amber-400';
      case 'MODEL':
        return 'text-blue-400';
      default:
        return 'text-slate-400';
    }
  };

  return (
    <div className="tech-card rounded-lg overflow-hidden border border-slate-800 flex flex-col font-mono-tech text-xs">
      {/* Terminal Title Bar */}
      <div className="bg-slate-900/90 px-3.5 py-2.5 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 mr-1">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
          </div>
          <Terminal className="w-3.5 h-3.5 text-cyan-400" />
          <span className="font-semibold text-slate-200 tracking-wide">{title}</span>
          <span className="text-[10px] text-slate-400">(/dev/kmsg + nca-rt)</span>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-1.5">
          {/* Module Filter */}
          <div className="flex items-center gap-1 bg-slate-950/80 px-2 py-0.5 rounded border border-slate-800">
            <Filter className="w-3 h-3 text-slate-400" />
            <select
              value={filterModule}
              onChange={(e) => setFilterModule(e.target.value)}
              className="bg-transparent text-[11px] text-slate-300 focus:outline-none cursor-pointer"
            >
              <option value="ALL" className="bg-slate-900">ALL</option>
              <option value="FPGA" className="bg-slate-900">FPGA</option>
              <option value="RUNTIME" className="bg-slate-900">RUNTIME</option>
              <option value="COMM" className="bg-slate-900">COMM</option>
              <option value="HOST" className="bg-slate-900">HOST</option>
              <option value="MODEL" className="bg-slate-900">MODEL</option>
            </select>
          </div>

          {/* Auto Scroll toggle */}
          <button
            onClick={() => setAutoScroll(!autoScroll)}
            title="Toggle auto-scroll"
            className={`p-1 rounded border ${
              autoScroll
                ? 'bg-cyan-950/60 border-cyan-700/60 text-cyan-400'
                : 'bg-slate-950/60 border-slate-800 text-slate-400'
            }`}
          >
            <ArrowDown className="w-3 h-3" />
          </button>

          {/* Download */}
          <button
            onClick={downloadLogs}
            title="Download log file"
            className="p-1 rounded bg-slate-950/60 border border-slate-800 text-slate-400 hover:text-cyan-400 hover:border-cyan-800 transition-colors"
          >
            <Download className="w-3 h-3" />
          </button>

          {/* Clear */}
          <button
            onClick={clearLogs}
            title="Clear logs"
            className="p-1 rounded bg-slate-950/60 border border-slate-800 text-slate-400 hover:text-rose-400 hover:border-rose-800 transition-colors"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Terminal Content Stream */}
      <div
        ref={logContainerRef}
        className={`bg-[#05070d] p-3 overflow-y-auto space-y-1 terminal-grid select-text ${maxHeight}`}
      >
        {filteredLogs.length === 0 ? (
          <div className="text-slate-400 py-4 text-center italic">
            -- Log buffer is empty --
          </div>
        ) : (
          filteredLogs.slice().reverse().map((log) => (
            <div
              key={log.id}
              className="flex items-start gap-2 leading-relaxed hover:bg-slate-900/40 px-1 rounded transition-colors group"
            >
              <span className="text-slate-400 select-none text-[11px] shrink-0 font-mono-tech">
                [{log.timestamp}]
              </span>

              <span
                className={`font-semibold shrink-0 text-[10px] ${getModuleStyle(log.module)}`}
              >
                [{log.module}]
              </span>

              <span
                className={`text-[9px] px-1 py-0.2 rounded border uppercase font-mono-tech shrink-0 ${getLevelStyle(
                  log.level
                )}`}
              >
                {log.level}
              </span>

              <span className="text-slate-300 break-all text-[11px]">
                {log.message}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
