import React, { useState, useRef, useEffect } from 'react';
import { Terminal, Trash2, Download, Filter, ArrowDown } from 'lucide-react';
import { LogEntry } from '../../types';
import { useSystem } from '../../context/SystemContext';

interface RuntimeLogProps {
  maxHeight?: string;
  title?: string;
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

  const getLevelBadge = (level: LogEntry['level']) => {
    switch (level) {
      case 'NCE':
        return 'text-sky-300 bg-sky-950/80 border-sky-800';
      case 'PERF':
        return 'text-emerald-300 bg-emerald-950/80 border-emerald-800';
      case 'WARN':
        return 'text-amber-300 bg-amber-950/80 border-amber-800';
      case 'ERROR':
        return 'text-rose-300 bg-rose-950/80 border-rose-800';
      default:
        return 'text-slate-300 bg-slate-800 border-slate-700';
    }
  };

  const getModuleStyle = (module: LogEntry['module']) => {
    switch (module) {
      case 'FPGA':
        return 'text-emerald-400';
      case 'COMM':
        return 'text-blue-400';
      case 'RUNTIME':
        return 'text-sky-300';
      case 'HOST':
        return 'text-amber-300';
      case 'MODEL':
        return 'text-indigo-300';
      default:
        return 'text-slate-400';
    }
  };

  return (
    <div className="rounded-lg overflow-hidden border border-[#D9E2EC] shadow-xs flex flex-col font-mono-tech text-xs bg-white">
      {/* Terminal Title Bar */}
      <div className="bg-[#172033] px-3.5 py-2.5 flex items-center justify-between border-b border-slate-700">
        <div className="flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-blue-400" />
          <span className="font-semibold text-slate-100 font-sans tracking-wide">{title}</span>
          <span className="text-[10px] text-slate-400 font-mono-tech">(/dev/kmsg + nca-rt)</span>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-1.5">
          {/* Module Filter */}
          <div className="flex items-center gap-1 bg-[#101726] px-2 py-0.5 rounded border border-slate-700">
            <Filter className="w-3 h-3 text-slate-400" />
            <select
              value={filterModule}
              onChange={(e) => setFilterModule(e.target.value)}
              className="bg-transparent text-[11px] text-slate-300 focus:outline-none cursor-pointer"
            >
              <option value="ALL" className="bg-[#172033]">ALL</option>
              <option value="FPGA" className="bg-[#172033]">FPGA</option>
              <option value="RUNTIME" className="bg-[#172033]">RUNTIME</option>
              <option value="COMM" className="bg-[#172033]">COMM</option>
              <option value="HOST" className="bg-[#172033]">HOST</option>
              <option value="MODEL" className="bg-[#172033]">MODEL</option>
            </select>
          </div>

          {/* Auto Scroll toggle */}
          <button
            onClick={() => setAutoScroll(!autoScroll)}
            title="Toggle auto-scroll"
            className={`p-1 rounded border ${
              autoScroll
                ? 'bg-blue-600 border-blue-500 text-white'
                : 'bg-[#101726] border-slate-700 text-slate-400'
            }`}
          >
            <ArrowDown className="w-3 h-3" />
          </button>

          {/* Download */}
          <button
            onClick={downloadLogs}
            title="Download log file"
            className="p-1 rounded bg-[#101726] border border-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <Download className="w-3 h-3" />
          </button>

          {/* Clear */}
          <button
            onClick={clearLogs}
            title="Clear logs"
            className="p-1 rounded bg-[#101726] border border-slate-700 text-slate-400 hover:text-rose-400 transition-colors"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Terminal Content Stream (#172033 background) */}
      <div
        ref={logContainerRef}
        className={`bg-[#172033] p-3 overflow-y-auto space-y-1 select-text ${maxHeight}`}
      >
        {filteredLogs.length === 0 ? (
          <div className="text-slate-500 py-4 text-center italic">
            -- Log buffer is empty --
          </div>
        ) : (
          filteredLogs.slice().reverse().map((log) => (
            <div
              key={log.id}
              className="flex items-start gap-2 leading-relaxed hover:bg-slate-800/40 px-1 rounded transition-colors"
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
                className={`text-[9px] px-1 py-0.2 rounded border uppercase font-mono-tech shrink-0 ${getLevelBadge(
                  log.level
                )}`}
              >
                {log.level}
              </span>

              <span className="text-[#DCE6F0] break-all text-[11px]">
                {log.message}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
