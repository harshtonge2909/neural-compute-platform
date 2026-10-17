import React, { useState, useEffect } from 'react';
import { 
  Server, 
  Cpu, 
  Cable, 
  Sliders, 
  Activity, 
  CheckCircle, 
  RefreshCw, 
  AlertTriangle,
  Play
} from 'lucide-react';
import { useSystem } from '../context/SystemContext';
import { realBackend } from '../services/api';
import { DeviceInfo, AppSettings } from '../types';
import { RuntimeLog } from '../components/common/RuntimeLog';

export const DeviceSettings: React.FC = () => {
  const { addLog, hardwareMode, setHardwareMode, refreshTelemetry } = useSystem();

  const [devices, setDevices] = useState<DeviceInfo[]>([]);
  const [loadingDevices, setLoadingDevices] = useState<boolean>(false);
  const [connectingId, setConnectingId] = useState<string | null>(null);
  const [loopbackResult, setLoopbackResult] = useState<{ success?: boolean; latencyMs?: number; message?: string; error?: string } | null>(null);
  const [testingLoopback, setTestingLoopback] = useState<boolean>(false);

  const [settings, setSettings] = useState<AppSettings>({
    general: {
      theme: 'light',
      logVerbosity: 'INFO',
      autoConnectHardware: false,
      telemetryIntervalMs: 1000
    },
    runtime: {
      defaultBackend: 'cpu',
      defaultDetectionModel: 'YOLOX-Nano',
      confidenceThreshold: 0.35,
      llmModelPath: 'builtin',
      llmMaxTokens: 128,
      llmTemperature: 0.7,
      cpuThreads: 4
    },
    hardware: {
      connectionType: 'network_rest',
      targetHost: '192.168.1.120',
      targetPort: 8080,
      serialPort: '/dev/ttyUSB0',
      baudRate: 115200,
      spiDevice: '/dev/spidev0.0',
      charDevice: '/dev/nce0',
      timeoutMs: 3000,
      allowSimulationFallback: false
    },
    benchmarks: {
      defaultRepetitions: 5,
      defaultWarmupRuns: 2,
      defaultMatrixDimension: 256
    }
  });

  const [savingSettings, setSavingSettings] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  // Fetch devices and settings on mount
  const fetchDevicesAndSettings = async () => {
    setLoadingDevices(true);
    try {
      const [devList, appSet] = await Promise.all([
        realBackend.listDevices(),
        realBackend.getSettings()
      ]);
      if (devList) setDevices(devList);
      if (appSet) setSettings(appSet);
    } catch {
      // Fallback local devices
      setDevices([
        {
          id: 'milkv-mars-net',
          name: 'Milk-V Mars RISC-V Host (REST Daemon)',
          type: 'ethernet',
          address: '192.168.1.120:8080',
          status: 'DISCONNECTED',
          description: 'StarFive JH7110 Quad-Core RV64GC Linux Host over Ethernet',
          firmwareVersion: 'Linux 6.1-riscv64',
          driverLoaded: true
        },
        {
          id: 'fpga-char-dev',
          name: 'FPGA NCE Character Device (/dev/nce0)',
          type: 'char_device',
          address: '/dev/nce0',
          status: 'UNAVAILABLE',
          description: 'Direct Linux Kernel character device driver for FPGA DMA',
          firmwareVersion: null,
          driverLoaded: false
        }
      ]);
    } finally {
      setLoadingDevices(false);
    }
  };

  useEffect(() => {
    fetchDevicesAndSettings();
  }, []);

  const handleConnectDevice = async (device: DeviceInfo) => {
    setConnectingId(device.id);
    addLog('COMM', 'INFO', `Connecting to ${device.name}...`);
    try {
      const res = await realBackend.connectDevice(device.id);
      if (res && res.success) {
        addLog('COMM', 'INFO', `Successfully connected to ${device.name}`);
        setHardwareMode('hardware');
      } else {
        addLog('COMM', 'WARN', `Failed connecting to ${device.name}: ${res?.message || 'Host unreachable'}`);
      }
      await fetchDevicesAndSettings();
      await refreshTelemetry();
    } catch (err: any) {
      addLog('COMM', 'ERROR', `Connection error: ${err.message}`);
    } finally {
      setConnectingId(null);
    }
  };

  const handleDisconnectDevice = async (device: DeviceInfo) => {
    setConnectingId(device.id);
    addLog('COMM', 'INFO', `Disconnecting from ${device.name}...`);
    try {
      await realBackend.disconnectDevice(device.id);
      addLog('COMM', 'INFO', `${device.name} disconnected`);
      await fetchDevicesAndSettings();
      await refreshTelemetry();
    } catch (err: any) {
      addLog('COMM', 'ERROR', `Disconnection error: ${err.message}`);
    } finally {
      setConnectingId(null);
    }
  };

  const handleTestLoopback = async () => {
    setTestingLoopback(true);
    setLoopbackResult(null);
    addLog('COMM', 'INFO', 'Sending hardware loopback test packet (PING 0x55AA)...');
    try {
      const res = await realBackend.testLoopback();
      setLoopbackResult(res);
      if (res.success) {
        addLog('COMM', 'INFO', `Loopback verified: ${res.latencyMs}ms roundtrip`);
      } else {
        addLog('COMM', 'WARN', `Loopback failed: ${res.error || 'Hardware not connected'}`);
      }
    } catch (err: any) {
      setLoopbackResult({ success: false, error: err.message });
      addLog('COMM', 'ERROR', `Loopback exception: ${err.message}`);
    } finally {
      setTestingLoopback(false);
    }
  };

  const handleSaveSettings = async () => {
    setSavingSettings(true);
    setSaveSuccess(false);
    try {
      await realBackend.updateSettings(settings);
      setSaveSuccess(true);
      addLog('RUNTIME', 'INFO', 'Configuration saved to persistent disk settings');
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch (err: any) {
      addLog('RUNTIME', 'ERROR', `Failed saving settings: ${err.message}`);
    } finally {
      setSavingSettings(false);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#D9E2EC]">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-bold text-[#172033] tracking-tight">
              Device & Settings
            </h1>
            <span className="text-xs px-2 py-0.5 rounded bg-blue-50 border border-blue-200 text-blue-700 font-semibold font-mono">
              Hardware Configuration
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#526174] mt-1">
            Configure Milk-V Mars RISC-V connection, FPGA interfaces, model parameters, and persistent runtime settings
          </p>
        </div>

        <button
          onClick={handleSaveSettings}
          disabled={savingSettings}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg font-sans text-xs font-semibold shadow-xs cursor-pointer transition-all ${
            saveSuccess
              ? 'bg-emerald-600 text-white'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {savingSettings ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Saving...</span>
            </>
          ) : saveSuccess ? (
            <>
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Saved Successfully</span>
            </>
          ) : (
            <>
              <Server className="w-3.5 h-3.5" />
              <span>Save Configuration</span>
            </>
          )}
        </button>
      </div>

      {/* Hardware Interface Discovery & Connectivity */}
      <div className="bg-white rounded-xl p-6 border border-[#D9E2EC] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#D9E2EC] gap-2">
          <div className="flex items-center gap-2">
            <Cable className="w-4 h-4 text-blue-600" />
            <h2 className="font-semibold text-[#172033] text-sm">
              Hardware Interfaces & Device Discovery
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleTestLoopback}
              disabled={testingLoopback}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#F8FAFC] border border-[#D9E2EC] hover:bg-slate-100 text-[#172033] text-xs font-medium cursor-pointer transition-colors"
            >
              <Play className="w-3 h-3 text-blue-600" />
              <span>{testingLoopback ? 'Testing...' : 'Test Loopback Packet'}</span>
            </button>
            <button
              onClick={fetchDevicesAndSettings}
              disabled={loadingDevices}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#F8FAFC] border border-[#D9E2EC] hover:bg-slate-100 text-[#526174] text-xs font-medium cursor-pointer transition-colors"
            >
              <RefreshCw className={`w-3 h-3 ${loadingDevices ? 'animate-spin' : ''}`} />
              <span>Rescan</span>
            </button>
          </div>
        </div>

        {/* Loopback Result Toast */}
        {loopbackResult && (
          <div className={`p-3 rounded-lg border text-xs flex items-center justify-between ${
            loopbackResult.success 
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
              : 'bg-amber-50 border-amber-200 text-amber-900'
          }`}>
            <div className="flex items-center gap-2">
              {loopbackResult.success ? (
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              )}
              <span>{loopbackResult.message || loopbackResult.error}</span>
            </div>
            {loopbackResult.latencyMs && (
              <span className="font-mono font-semibold">{loopbackResult.latencyMs} ms</span>
            )}
          </div>
        )}

        {/* Discovered Device Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {devices.map((device) => {
            const isConnected = device.status === 'CONNECTED';
            const isUnavailable = device.status === 'UNAVAILABLE';
            return (
              <div
                key={device.id}
                className="p-4 rounded-xl border border-[#D9E2EC] bg-[#F8FAFC] space-y-2 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-xs sm:text-sm text-[#172033]">
                        {device.name}
                      </h3>
                      <span className="text-[11px] font-mono text-[#526174] block mt-0.5">
                        {device.address}
                      </span>
                    </div>

                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-mono font-semibold uppercase ${
                        isConnected
                          ? 'bg-emerald-50 border border-emerald-300 text-emerald-700'
                          : isUnavailable
                          ? 'bg-slate-100 border border-slate-200 text-slate-500'
                          : 'bg-amber-50 border border-amber-300 text-amber-700'
                      }`}
                    >
                      {device.status}
                    </span>
                  </div>

                  <p className="text-xs text-[#526174] mt-2">
                    {device.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#D9E2EC] flex items-center justify-between">
                  <span className="text-[10px] text-[#718096] font-mono">
                    Driver: {device.driverLoaded ? 'Loaded' : 'Not Loaded'}
                  </span>

                  {isConnected ? (
                    <button
                      onClick={() => handleDisconnectDevice(device)}
                      disabled={connectingId === device.id}
                      className="px-3 py-1 rounded bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 text-xs font-medium cursor-pointer"
                    >
                      Disconnect
                    </button>
                  ) : (
                    <button
                      onClick={() => handleConnectDevice(device)}
                      disabled={connectingId === device.id || isUnavailable}
                      className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold cursor-pointer disabled:opacity-50"
                    >
                      {connectingId === device.id ? 'Connecting...' : 'Connect'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Configuration Tabs / Form Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* General Settings */}
        <div className="bg-white rounded-xl p-5 border border-[#D9E2EC] shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-[#D9E2EC]">
            <Sliders className="w-4 h-4 text-blue-600" />
            <h2 className="font-semibold text-[#172033] text-sm">General Settings</h2>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="font-medium text-[#172033] block mb-1">Color Theme</label>
              <select
                value={settings.general.theme}
                onChange={(e) => setSettings({ ...settings, general: { ...settings.general, theme: e.target.value } })}
                className="w-full bg-white border border-[#D9E2EC] rounded-lg px-3 py-2 text-[#172033]"
              >
                <option value="light">Engineering Light (Recommended for Presentations)</option>
                <option value="dark">Dark Console</option>
              </select>
            </div>

            <div>
              <label className="font-medium text-[#172033] block mb-1">Log Verbosity</label>
              <select
                value={settings.general.logVerbosity}
                onChange={(e) => setSettings({ ...settings, general: { ...settings.general, logVerbosity: e.target.value } })}
                className="w-full bg-white border border-[#D9E2EC] rounded-lg px-3 py-2 text-[#172033]"
              >
                <option value="DEBUG">DEBUG (Detailed bus & packet transactions)</option>
                <option value="INFO">INFO (Standard execution logs)</option>
                <option value="WARN">WARN (Warnings and errors only)</option>
              </select>
            </div>

            <div className="flex items-center justify-between pt-1">
              <div>
                <span className="font-medium text-[#172033] block">Auto-Connect Hardware</span>
                <span className="text-[11px] text-[#718096]">Attempt hardware connection on application startup</span>
              </div>
              <input
                type="checkbox"
                checked={settings.general.autoConnectHardware}
                onChange={(e) => setSettings({ ...settings, general: { ...settings.general, autoConnectHardware: e.target.checked } })}
                className="w-4 h-4 text-blue-600 rounded cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* AI Runtime Settings */}
        <div className="bg-white rounded-xl p-5 border border-[#D9E2EC] shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-[#D9E2EC]">
            <Cpu className="w-4 h-4 text-blue-600" />
            <h2 className="font-semibold text-[#172033] text-sm">AI Runtime & Models</h2>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="font-medium text-[#172033] block mb-1">Default Inference Backend</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setSettings({ ...settings, runtime: { ...settings.runtime, defaultBackend: 'cpu' } })}
                  className={`py-2 px-3 rounded-lg border text-center transition-all cursor-pointer ${
                    settings.runtime.defaultBackend === 'cpu'
                      ? 'bg-blue-50 border-blue-400 text-blue-800 font-semibold'
                      : 'bg-white border-[#D9E2EC] text-[#526174]'
                  }`}
                >
                  CPU Host
                </button>
                <button
                  type="button"
                  onClick={() => setSettings({ ...settings, runtime: { ...settings.runtime, defaultBackend: 'fpga' } })}
                  className={`py-2 px-3 rounded-lg border text-center transition-all cursor-pointer ${
                    settings.runtime.defaultBackend === 'fpga'
                      ? 'bg-emerald-50 border-emerald-400 text-emerald-800 font-semibold'
                      : 'bg-white border-[#D9E2EC] text-[#526174]'
                  }`}
                >
                  FPGA Accelerator
                </button>
              </div>
            </div>

            <div>
              <label className="font-medium text-[#172033] block mb-1">
                Object Detection Confidence Threshold ({Math.round(settings.runtime.confidenceThreshold * 100)}%)
              </label>
              <input
                type="range"
                min="0.10"
                max="0.90"
                step="0.05"
                value={settings.runtime.confidenceThreshold}
                onChange={(e) => setSettings({ ...settings, runtime: { ...settings.runtime, confidenceThreshold: parseFloat(e.target.value) } })}
                className="w-full accent-blue-600 cursor-pointer"
              />
            </div>

            <div>
              <label className="font-medium text-[#172033] block mb-1">Tiny LLM Max Generation Tokens</label>
              <input
                type="number"
                min="16"
                max="512"
                value={settings.runtime.llmMaxTokens}
                onChange={(e) => setSettings({ ...settings, runtime: { ...settings.runtime, llmMaxTokens: parseInt(e.target.value) || 128 } })}
                className="w-full bg-white border border-[#D9E2EC] rounded-lg px-3 py-2 text-[#172033] font-mono"
              />
            </div>
          </div>
        </div>

        {/* Hardware Transport Settings */}
        <div className="bg-white rounded-xl p-5 border border-[#D9E2EC] shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-[#D9E2EC]">
            <Activity className="w-4 h-4 text-blue-600" />
            <h2 className="font-semibold text-[#172033] text-sm">Hardware Bus & Network Config</h2>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="font-medium text-[#172033] block mb-1">Milk-V Mars IP Address / Host</label>
              <input
                type="text"
                value={settings.hardware.targetHost}
                onChange={(e) => setSettings({ ...settings, hardware: { ...settings.hardware, targetHost: e.target.value } })}
                className="w-full bg-white border border-[#D9E2EC] rounded-lg px-3 py-2 text-[#172033] font-mono"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="font-medium text-[#172033] block mb-1">REST Daemon Port</label>
                <input
                  type="number"
                  value={settings.hardware.targetPort}
                  onChange={(e) => setSettings({ ...settings, hardware: { ...settings.hardware, targetPort: parseInt(e.target.value) || 8080 } })}
                  className="w-full bg-white border border-[#D9E2EC] rounded-lg px-3 py-2 text-[#172033] font-mono"
                />
              </div>

              <div>
                <label className="font-medium text-[#172033] block mb-1">Timeout (ms)</label>
                <input
                  type="number"
                  value={settings.hardware.timeoutMs}
                  onChange={(e) => setSettings({ ...settings, hardware: { ...settings.hardware, timeoutMs: parseInt(e.target.value) || 3000 } })}
                  className="w-full bg-white border border-[#D9E2EC] rounded-lg px-3 py-2 text-[#172033] font-mono"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <div>
                <span className="font-medium text-[#172033] block">Allow CPU Fallback</span>
                <span className="text-[11px] text-[#718096]">Fall back to CPU when FPGA hardware is unavailable</span>
              </div>
              <input
                type="checkbox"
                checked={settings.hardware.allowSimulationFallback}
                onChange={(e) => setSettings({ ...settings, hardware: { ...settings.hardware, allowSimulationFallback: e.target.checked } })}
                className="w-4 h-4 text-blue-600 rounded cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Benchmarking Defaults */}
        <div className="bg-white rounded-xl p-5 border border-[#D9E2EC] shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-[#D9E2EC]">
            <Activity className="w-4 h-4 text-blue-600" />
            <h2 className="font-semibold text-[#172033] text-sm">Benchmarking Defaults</h2>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="font-medium text-[#172033] block mb-1">Default Repetitions</label>
              <input
                type="number"
                min="1"
                max="50"
                value={settings.benchmarks.defaultRepetitions}
                onChange={(e) => setSettings({ ...settings, benchmarks: { ...settings.benchmarks, defaultRepetitions: parseInt(e.target.value) || 5 } })}
                className="w-full bg-white border border-[#D9E2EC] rounded-lg px-3 py-2 text-[#172033] font-mono"
              />
            </div>

            <div>
              <label className="font-medium text-[#172033] block mb-1">Warm-up Runs</label>
              <input
                type="number"
                min="0"
                max="10"
                value={settings.benchmarks.defaultWarmupRuns}
                onChange={(e) => setSettings({ ...settings, benchmarks: { ...settings.benchmarks, defaultWarmupRuns: parseInt(e.target.value) || 2 } })}
                className="w-full bg-white border border-[#D9E2EC] rounded-lg px-3 py-2 text-[#172033] font-mono"
              />
            </div>

            <div>
              <label className="font-medium text-[#172033] block mb-1">Matrix Dimension (N x N)</label>
              <select
                value={settings.benchmarks.defaultMatrixDimension}
                onChange={(e) => setSettings({ ...settings, benchmarks: { ...settings.benchmarks, defaultMatrixDimension: parseInt(e.target.value) || 256 } })}
                className="w-full bg-white border border-[#D9E2EC] rounded-lg px-3 py-2 text-[#172033] font-mono"
              >
                <option value="64">64 x 64 (NCE Systolic Array Native Dimension)</option>
                <option value="128">128 x 128 (Tiled Evaluation)</option>
                <option value="256">256 x 256 (Standard Edge Benchmark)</option>
                <option value="512">512 x 512 (Stress Test)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Embedded Runtime Diagnostic Log */}
      <RuntimeLog maxHeight="max-h-48" title="Device Configuration & Bus Activity Log" />
    </div>
  );
};
