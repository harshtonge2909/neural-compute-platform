import React, { useState } from 'react';
import { X, Server, RefreshCw, CheckCircle } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
      <div className="bg-white rounded-xl border border-[#D9E2EC] w-full max-w-md overflow-hidden shadow-xl font-sans">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#D9E2EC] bg-[#F8FAFC]">
          <div className="flex items-center gap-2">
            <Server className="w-4 h-4 text-blue-600" />
            <span className="font-bold text-[#172033] text-sm">
              System Configuration
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-xs">
          {/* Mode switch */}
          <div>
            <label className="text-[#172033] block mb-1.5 font-semibold">
              Hardware Connection Target
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setHardwareMode('simulation')}
                className={`py-2 px-3 rounded-lg border text-center transition-all cursor-pointer ${
                  hardwareMode === 'simulation'
                    ? 'bg-amber-50 border-amber-300 text-amber-900 font-semibold'
                    : 'bg-white border-[#D9E2EC] text-[#526174] hover:bg-slate-50'
                }`}
              >
                Simulation Mode
              </button>
              <button
                onClick={() => setHardwareMode('hardware')}
                className={`py-2 px-3 rounded-lg border text-center transition-all cursor-pointer ${
                  hardwareMode === 'hardware'
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-semibold'
                    : 'bg-white border-[#D9E2EC] text-[#526174] hover:bg-slate-50'
                }`}
              >
                Hardware Connected
              </button>
            </div>
            <p className="text-[11px] text-[#718096] mt-1.5">
              Simulation mode uses client-side mock models. Hardware mode issues live REST calls to Milk-V Mars.
            </p>
          </div>

          {/* API Base URL */}
          <div>
            <label className="text-[#172033] block mb-1.5 font-semibold">
              Milk-V Mars REST API Endpoint
            </label>
            <input
              type="text"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              placeholder="http://192.168.1.120:8080"
              className="w-full bg-white border border-[#D9E2EC] px-3 py-2 rounded-lg text-[#172033] focus:outline-none focus:border-blue-500 font-mono-tech text-xs"
            />
            <span className="text-[11px] text-[#718096] mt-1 block">
              Default StarFive JH7110 edge daemon runs on port 8080.
            </span>
          </div>

          {/* Hardware Specs summary */}
          <div className="p-3 rounded-lg bg-[#F8FAFC] border border-[#D9E2EC] space-y-1.5 text-[11px]">
            <div className="flex items-center justify-between text-[#526174]">
              <span>Host SoC:</span>
              <span className="text-[#172033] font-medium font-mono-tech">{systemStatus.processor}</span>
            </div>
            <div className="flex items-center justify-between text-[#526174]">
              <span>FPGA Accelerator:</span>
              <span className="text-[#172033] font-medium font-mono-tech">{systemStatus.fpgaModel}</span>
            </div>
            <div className="flex items-center justify-between text-[#526174]">
              <span>Engine Clock:</span>
              <span className="text-blue-700 font-medium font-mono-tech">{systemStatus.clockFrequencies.nceEngineMhz} MHz</span>
            </div>
            <div className="flex items-center justify-between text-[#526174]">
              <span>Host SPI Bus:</span>
              <span className="text-blue-700 font-medium font-mono-tech">{systemStatus.clockFrequencies.spiBusMhz} MHz</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-[#D9E2EC] bg-[#F8FAFC]">
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg text-xs text-[#526174] hover:text-[#172033] hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saved}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs transition-all shadow-xs cursor-pointer disabled:opacity-75"
          >
            {saved ? (
              <>
                <CheckCircle className="w-3.5 h-3.5 text-white" />
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
