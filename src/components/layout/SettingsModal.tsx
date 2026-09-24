import React, { useState } from 'react';
import { X, Server, RefreshCw, Cpu, CheckCircle } from 'lucide-react';
import { useSystem } from '../../context/SystemContext';

interface SettingsModalProps {
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ onClose }) => {
  const { 
    apiBaseUrl, 
    setApiBaseUrl, 
    hardwareMode, 
    setHardwareMode,
    addLog,
    systemStatus
  } = useSystem();

  const [inputUrl, setInputUrl] = useState(apiBaseUrl);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setApiBaseUrl(inputUrl);
    setSaved(true);
    addLog('RUNTIME', 'INFO', `API gateway configuration updated: ${inputUrl}`);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="tech-card rounded-xl border border-slate-700/80 bg-[#0c101d] w-full max-w-md overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-900/60">
          <div className="flex items-center gap-2">
            <Server className="w-4 h-4 text-cyan-400" />
            <span className="font-bold text-slate-100 font-mono-tech text-sm">
              SYSTEM CONFIGURATION
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-5 text-xs font-mono-tech">
          {/* Mode switch */}
          <div>
            <label className="text-slate-300 block mb-2 font-medium">
              HARDWARE CONNECTION TARGET
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setHardwareMode('simulation')}
                className={`py-2 px-3 rounded border text-center transition-all ${
                  hardwareMode === 'simulation'
                    ? 'bg-amber-950/70 border-amber-500 text-amber-300 font-semibold'
                    : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                Simulation Mode
              </button>
              <button
                onClick={() => setHardwareMode('hardware')}
                className={`py-2 px-3 rounded border text-center transition-all ${
                  hardwareMode === 'hardware'
                    ? 'bg-emerald-950/70 border-emerald-500 text-emerald-300 font-semibold'
                    : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                Hardware Connected
              </button>
            </div>
            <p className="text-[11px] text-slate-400 mt-1.5">
              Simulation mode uses client-side mock models and hardware telemetry. Hardware mode issues live REST calls to Milk-V Mars.
            </p>
          </div>

          {/* API Base URL */}
          <div>
            <label className="text-slate-300 block mb-1.5 font-medium">
              MILK-V MARS REST API ENDPOINT
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                placeholder="http://192.168.1.120:8080"
                className="w-full bg-slate-950 border border-slate-700 px-3 py-2 rounded text-slate-200 focus:outline-none focus:border-cyan-500 font-mono-tech text-xs"
              />
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">
              Default StarFive JH7110 edge daemon runs on port 8080.
            </span>
          </div>

          {/* Hardware Specs summary */}
          <div className="p-3 rounded bg-slate-950/60 border border-slate-800 space-y-1.5 text-[11px]">
            <div className="flex items-center justify-between text-slate-400">
              <span>Host SoC:</span>
              <span className="text-slate-200 font-mono-tech">{systemStatus.processor}</span>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span>FPGA Accelerator:</span>
              <span className="text-slate-200 font-mono-tech">{systemStatus.fpgaModel}</span>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span>Engine Clock:</span>
              <span className="text-cyan-400 font-mono-tech">{systemStatus.clockFrequencies.nceEngineMhz} MHz</span>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span>Host SPI Bus:</span>
              <span className="text-purple-400 font-mono-tech">{systemStatus.clockFrequencies.spiBusMhz} MHz</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-slate-800 bg-slate-900/40">
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded text-xs text-slate-400 hover:text-slate-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saved}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-xs transition-all shadow-[0_0_12px_rgba(8,145,178,0.4)] disabled:opacity-75"
          >
            {saved ? (
              <>
                <CheckCircle className="w-3.5 h-3.5 text-emerald-300" />
                <span>Saved</span>
              </>
            ) : (
              <>
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Save Configuration</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
