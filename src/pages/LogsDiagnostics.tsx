import React, { useState, useMemo } from 'react';
import { 
  FileText, 
  Trash2, 
  Download, 
  Search, 
  RefreshCw, 
  Filter, 
  ShieldAlert, 
  CheckCircle, 
  Info, 
  Zap 
} from 'lucide-react';
import { useSystem } from '../context/SystemContext';
import { LogEntry } from '../types';

export const LogsDiagnostics: React.FC = () => {
  const { logs, clearLogs, refreshTelemetry } = useSystem();
  
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedLevel, setSelectedLevel] = useState<string>('ALL');
  const [selectedModule, setSelectedModule] = useState<string>('ALL');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshTelemetry();
    setTimeout(() => setIsRefreshing(false), 400);
  };

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchSearch = searchQuery === '' || 
        log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.module.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.timestamp.includes(searchQuery);

      const matchLevel = selectedLevel === 'ALL' || log.level.toUpperCase() === selectedLevel.toUpperCase();
      const matchModule = selectedModule === 'ALL' || log.module.toUpperCase() === selectedModule.toUpperCase();

      return matchSearch && matchLevel && matchModule;
    });
  }, [logs, searchQuery, selectedLevel, selectedModule]);

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(filteredLogs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `nca_diagnostics_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleExportCSV = () => {
    let csv = "ID,Timestamp,Level,Module,Message\n";
    filteredLogs.forEach((l) => {
      const escaped = `"${l.message.replace(/"/g, '""')}"`;
      csv += `${l.id},${l.timestamp},${l.level},${l.module},${escaped}\n`;
    });
    const dataStr = "data:text/csv;charset=utf-8," + encodeURIComponent(csv);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `nca_diagnostics_${Date.now()}.csv`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const getLevelBadge = (level: string) => {
    switch (level.toUpperCase()) {
      case 'ERROR':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-rose-50 border border-rose-200 text-rose-700">ERROR</span>;
      case 'WARN':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-amber-50 border border-amber-200 text-amber-700">WARN</span>;
      case 'PERF':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-purple-50 border border-purple-200 text-purple-700">PERF</span>;
      case 'NCE':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-blue-50 border border-blue-200 text-blue-700">NCE</span>;
      case 'INFO':
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-emerald-50 border border-emerald-200 text-emerald-700">INFO</span>;
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#D9E2EC]">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-bold text-[#172033] tracking-tight">
              Logs & Diagnostics
            </h1>
            <span className="text-xs px-2 py-0.5 rounded bg-blue-50 border border-blue-200 text-blue-700 font-semibold font-mono">
              System Telemetry Stream
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#526174] mt-1">
            Real-time operating system events, FPGA transactions, hardware communication traces, and inference logs
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white border border-[#D9E2EC] hover:bg-slate-50 text-[#172033] text-xs font-medium cursor-pointer transition-colors shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-blue-600" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={handleExportJSON}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white border border-[#D9E2EC] hover:bg-slate-50 text-[#172033] text-xs font-medium cursor-pointer transition-colors shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-blue-600" />
            <span>Export JSON</span>
          </button>
          <button
            onClick={clearLogs}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-700 text-xs font-medium cursor-pointer transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl p-4 border border-[#D9E2EC] shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row items-center gap-3">
          {/* Search box */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search logs by keyword, module, or timestamp..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#F8FAFC] border border-[#D9E2EC] pl-9 pr-3 py-2 rounded-lg text-xs text-[#172033] focus:outline-none focus:border-blue-500 font-sans"
            />
          </div>

          {/* Level filter tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto">
            {['ALL', 'INFO', 'NCE', 'WARN', 'ERROR', 'PERF'].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setSelectedLevel(lvl)}
                className={`px-2.5 py-1.5 rounded-md text-xs font-medium font-mono cursor-pointer transition-all ${
                  selectedLevel === lvl
                    ? 'bg-blue-600 text-white font-semibold'
                    : 'bg-[#F8FAFC] border border-[#D9E2EC] text-[#526174] hover:bg-slate-100'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>

          {/* Rescan / Refresh Button */}
          <button
            onClick={handleRefresh}
            className="p-2 rounded-lg border border-[#D9E2EC] bg-[#F8FAFC] hover:bg-slate-100 text-[#526174] cursor-pointer"
            title="Refresh logs from backend"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Module Filter pills */}
        <div className="flex items-center gap-2 pt-1 border-t border-[#D9E2EC] text-[11px] text-[#526174]">
          <span className="font-semibold text-[#172033] flex items-center gap-1">
            <Filter className="w-3 h-3 text-blue-600" />
            Module:
          </span>
          <div className="flex items-center gap-1 overflow-x-auto">
            {['ALL', 'RUNTIME', 'HOST', 'COMM', 'FPGA', 'MODEL', 'PERF'].map((mod) => (
              <button
                key={mod}
                onClick={() => setSelectedModule(mod)}
                className={`px-2 py-0.5 rounded cursor-pointer ${
                  selectedModule === mod
                    ? 'bg-blue-50 text-blue-700 font-semibold border border-blue-200'
                    : 'text-[#526174] hover:bg-slate-100'
                }`}
              >
                {mod}
              </button>
            ))}
          </div>
          <span className="ml-auto font-mono text-[#718096]">
            Showing {filteredLogs.length} of {logs.length} entries
          </span>
        </div>
      </div>

      {/* Logs Table Container */}
      <div className="bg-[#172033] rounded-xl border border-slate-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto max-h-[560px]">
          <table className="w-full text-left font-mono text-xs">
            <thead className="bg-[#101726] border-b border-slate-700 text-slate-400 text-[11px] sticky top-0 z-10">
              <tr>
                <th className="py-2.5 px-4 font-semibold w-24">Time</th>
                <th className="py-2.5 px-3 font-semibold w-24">Level</th>
                <th className="py-2.5 px-3 font-semibold w-28">Module</th>
                <th className="py-2.5 px-4 font-semibold">Message</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-slate-500 font-sans text-xs">
                    No log events match the current filter criteria.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-2 px-4 text-slate-400 text-[11px] whitespace-nowrap">
                      {log.timestamp}
                    </td>
                    <td className="py-2 px-3 whitespace-nowrap">
                      {getLevelBadge(log.level)}
                    </td>
                    <td className="py-2 px-3 text-blue-400 font-semibold text-[11px] whitespace-nowrap">
                      [{log.module}]
                    </td>
                    <td className="py-2 px-4 text-[#DCE6F0] leading-relaxed break-all font-sans text-xs">
                      {log.message}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
