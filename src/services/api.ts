import { 
  AIBackend, 
  SystemStatus, 
  NCEStatus, 
  MetricSnapshot, 
  DetectionInput, 
  DetectionResult, 
  LLMInput, 
  LLMResult, 
  BenchmarkInput, 
  BenchmarkResult, 
  LogEntry,
  HardwareConnectionMode
} from '../types';
import { 
  INITIAL_SYSTEM_STATUS, 
  INITIAL_NCE_STATUS, 
  INITIAL_LOGS, 
  SAMPLE_IMAGES, 
  LLM_PRESETS,
  BENCHMARK_HISTORY
} from '../data/mockData';

let apiBaseUrl = 'http://127.0.0.1:8000';

export const setApiBaseUrl = (url: string) => {
  apiBaseUrl = url.replace(/\/$/, '');
};

export const getApiBaseUrl = () => apiBaseUrl;

/**
 * MockAIBackend: Provides high-fidelity simulation of the Milk-V Mars + FPGA NCE system
 */
export class MockAIBackend implements AIBackend {
  private systemStatus: SystemStatus = { ...INITIAL_SYSTEM_STATUS };
  private nceStatus: NCEStatus = { ...INITIAL_NCE_STATUS };
  private logs: LogEntry[] = [...INITIAL_LOGS];

  async getSystemStatus(): Promise<SystemStatus> {
    const cpuJitter = (Math.random() - 0.5) * 1.5;
    const fpgaJitter = (Math.random() - 0.5) * 1.2;
    return {
      ...this.systemStatus,
      uptimeSeconds: this.systemStatus.uptimeSeconds + 1,
      cpuTemperatureC: +(43.5 + cpuJitter).toFixed(1),
      fpgaTemperatureC: +(45.0 + fpgaJitter).toFixed(1),
    };
  }

  async getNCEStatus(): Promise<NCEStatus> {
    const jitter = (Math.random() - 0.5) * 4;
    return {
      ...this.nceStatus,
      macUtilization: Math.max(10, Math.min(95, +(this.nceStatus.macUtilization! + jitter).toFixed(0))),
      acceleratorUtilization: Math.max(15, Math.min(95, +(this.nceStatus.acceleratorUtilization! + jitter).toFixed(0))),
      powerEstimateWatts: +(4.6 + (Math.random() - 0.5) * 0.4).toFixed(2),
      dataTransferRateMBps: +(42.5 + (Math.random() - 0.5) * 2.0).toFixed(1),
    };
  }

  async getMetricsHistory(): Promise<MetricSnapshot[]> {
    const snapshots: MetricSnapshot[] = [];
    const now = Date.now();
    for (let i = 15; i >= 0; i--) {
      snapshots.push({
        timestamp: now - i * 2000,
        latencyMs: +(18.2 + (Math.random() - 0.5) * 1.8).toFixed(1),
        throughputFps: +(54.5 + (Math.random() - 0.5) * 2.5).toFixed(1),
        cpuUtilization: Math.round(29 + (Math.random() - 0.5) * 6),
        fpgaUtilization: Math.round(79 + (Math.random() - 0.5) * 8),
        powerWatts: +(4.7 + (Math.random() - 0.5) * 0.3).toFixed(2),
        energyJoules: +(0.088 + (Math.random() - 0.5) * 0.006).toFixed(3),
      });
    }
    return snapshots;
  }

  async runObjectDetection(
    input: DetectionInput,
    onProgress?: (stage: string, percent: number) => void
  ): Promise<DetectionResult> {
    const isFpga = input.backend === 'fpga';
    const stages = [
      { msg: 'Initializing runtime...', pct: 15, delay: 180 },
      { msg: 'Loading model: ' + input.modelName + ' [INT8]...', pct: 35, delay: 240 },
      { msg: 'Preparing input tensor (416x416 RGB)...', pct: 55, delay: 190 },
      { msg: isFpga ? 'Transferring tensor to FPGA on-chip SRAM via DMA...' : 'Allocating CPU matrix buffers...', pct: 75, delay: 220 },
      { msg: isFpga ? 'Executing on NCE (64x64 Systolic MAC Array)...' : 'Executing on RISC-V Quad-Core CPU...', pct: 90, delay: isFpga ? 280 : 600 },
      { msg: 'Retrieving detection tensors & post-processing NMS...', pct: 100, delay: 180 },
    ];

    for (const step of stages) {
      if (onProgress) onProgress(step.msg, step.pct);
      await new Promise(r => setTimeout(r, step.delay));
    }

    let detections = SAMPLE_IMAGES[0].defaultDetections;
    for (const sample of SAMPLE_IMAGES) {
      if (input.imageSource.includes(sample.id) || input.imageSource.includes(sample.category) || input.imageSource === sample.url) {
        detections = sample.defaultDetections;
        break;
      }
    }

    if (isFpga) {
      const nceExec = +(13.5 + (Math.random() - 0.5) * 0.8).toFixed(1);
      const preProc = +(2.1 + (Math.random() - 0.5) * 0.3).toFixed(1);
      const postProc = +(2.4 + (Math.random() - 0.5) * 0.3).toFixed(1);
      const totalLat = +(preProc + nceExec + postProc).toFixed(1);
      const fps = +(1000 / totalLat).toFixed(1);

      return {
        detections,
        totalObjects: detections.length,
        inferenceTimeMs: totalLat,
        preProcessingMs: preProc,
        nceExecutionMs: nceExec,
        postProcessingMs: postProc,
        fps,
        cpuUtilization: Math.round(28 + Math.random() * 4),
        fpgaUtilization: Math.round(79 + Math.random() * 6),
        energyJoules: +(0.088 + (Math.random() - 0.5) * 0.005).toFixed(3),
        backendUsed: 'fpga',
        tensorDimensions: '1 x 3 x 416 x 416 (INT8)',
        isSimulated: true
      };
    } else {
      const cpuExec = +(134.0 + (Math.random() - 0.5) * 6.0).toFixed(1);
      const preProc = +(3.2 + (Math.random() - 0.5) * 0.5).toFixed(1);
      const postProc = +(5.4 + (Math.random() - 0.5) * 0.8).toFixed(1);
      const totalLat = +(preProc + cpuExec + postProc).toFixed(1);
      const fps = +(1000 / totalLat).toFixed(1);

      return {
        detections,
        totalObjects: detections.length,
        inferenceTimeMs: totalLat,
        preProcessingMs: preProc,
        nceExecutionMs: 0,
        postProcessingMs: postProc,
        fps,
        cpuUtilization: Math.round(93 + Math.random() * 5),
        fpgaUtilization: 0,
        energyJoules: +(0.620 + (Math.random() - 0.5) * 0.03).toFixed(3),
        backendUsed: 'cpu',
        tensorDimensions: '1 x 3 x 416 x 416 (FP32)',
        isSimulated: true
      };
    }
  }

  async generateLLM(
    input: LLMInput,
    onToken?: (token: string, currentText: string) => void,
    onStage?: (stage: string) => void
  ): Promise<LLMResult> {
    if (onStage) onStage('Tokenization');
    await new Promise(r => setTimeout(r, 120));

    if (onStage) onStage('Tensor preparation');
    await new Promise(r => setTimeout(r, 150));

    if (onStage) onStage('Execution');
    await new Promise(r => setTimeout(r, 180));

    if (onStage) onStage('Token generation');

    let targetResponse = '';
    const matchedPreset = LLM_PRESETS.find(p => 
      input.prompt.toLowerCase().includes(p.prompt.toLowerCase().substring(0, 15)) ||
      p.prompt.toLowerCase().includes(input.prompt.toLowerCase().substring(0, 15))
    );

    if (matchedPreset) {
      targetResponse = matchedPreset.response;
    } else {
      targetResponse = `The Neural Computing Architecture (NCA) accelerator efficiently processes this query using hardware-optimized INT8 quantization on the Milk-V Mars RISC-V host. 

Regarding "${input.prompt.trim()}":
The host StarFive JH7110 RISC-V CPU offloads compute-heavy transformer linear projections and attention matrix multiplications directly to the 64x64 Systolic MAC Array in the FPGA Neural Compute Engine (NCE). 

By leveraging on-chip SRAM double-buffering, data movement overhead is minimized, sustaining ~18.7 tokens/sec throughput at under 4.8W total board power.`;
    }

    const words = targetResponse.split(' ');
    let currentText = '';
    const startTime = Date.now();

    for (let i = 0; i < words.length; i++) {
      const piece = (i === 0 ? '' : ' ') + words[i];
      currentText += piece;
      if (onToken) onToken(piece, currentText);
      await new Promise(r => setTimeout(r, 45 + Math.random() * 25));
    }

    const totalTimeSec = +((Date.now() - startTime) / 1000).toFixed(2);
    const tokensCount = words.length * 1.25;
    const tokPerSec = +(tokensCount / totalTimeSec).toFixed(1);

    return {
      text: currentText,
      tokensGenerated: Math.round(tokensCount),
      tokensPerSecond: tokPerSec,
      timeToFirstTokenMs: 215,
      totalGenerationTimeSec: totalTimeSec,
      cpuUtilization: Math.round(23 + Math.random() * 4),
      fpgaUtilization: Math.round(72 + Math.random() * 6),
      energyJoules: +(totalTimeSec * 0.09).toFixed(2),
      isSimulated: true
    };
  }

  async runBenchmark(
    input: BenchmarkInput,
    onProgress?: (percent: number, currentMsg: string) => void
  ): Promise<BenchmarkResult> {
    const isFpga = input.backend === 'fpga';
    const steps = [
      { pct: 20, msg: `Configuring ${input.workload} dataset...` },
      { pct: 45, msg: `Allocating memory buffers for ${input.backend.toUpperCase()} backend...` },
      { pct: 70, msg: `Executing warm-up iterations...` },
      { pct: 90, msg: `Executing timed measurement runs...` },
      { pct: 100, msg: `Compiling hardware telemetry & energy profiling...` },
    ];

    for (const s of steps) {
      if (onProgress) onProgress(s.pct, s.msg);
      await new Promise(r => setTimeout(r, 260));
    }

    const existing = BENCHMARK_HISTORY.find(b => b.workload === input.workload && b.backend === input.backend);
    if (existing) {
      const jitter = (Math.random() - 0.5) * 0.05;
      return {
        ...existing,
        id: 'bm-' + Date.now(),
        timestamp: new Date().toLocaleTimeString(),
        latencyMs: +(existing.latencyMs * (1 + jitter)).toFixed(1),
        throughputFps: +(existing.throughputFps * (1 - jitter)).toFixed(1),
      };
    }

    return {
      id: 'bm-' + Date.now(),
      timestamp: new Date().toLocaleTimeString(),
      workload: input.workload,
      backend: input.backend,
      latencyMs: isFpga ? 15.2 : 120.4,
      throughputFps: isFpga ? 65.8 : 8.3,
      cpuUtilization: isFpga ? 24.5 : 94.0,
      fpgaUtilization: isFpga ? 78.0 : 0.0,
      energyJoules: isFpga ? 0.075 : 0.54,
      powerWatts: isFpga ? 4.75 : 4.40,
      speedupFactor: isFpga ? 7.9 : undefined,
      energyEfficiencyGain: isFpga ? 86.1 : undefined,
      isSimulated: true
    };
  }

  async getLogs(): Promise<LogEntry[]> {
    return this.logs;
  }
}

/**
 * RealAIBackend: Makes actual HTTP/REST calls to the Python FastAPI backend.
 */
export class RealAIBackend implements AIBackend {
  async getSystemStatus(): Promise<SystemStatus> {
    try {
      const res = await fetch(`${apiBaseUrl}/api/system/status`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch {
      return { 
        ...INITIAL_SYSTEM_STATUS, 
        communicationStatus: 'DISCONNECTED', 
        nceState: 'IDLE',
        fpgaStatus: 'OFFLINE',
        fpgaTemperatureC: null,
      };
    }
  }

  async getNCEStatus(): Promise<NCEStatus> {
    try {
      const res = await fetch(`${apiBaseUrl}/api/nce/status`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch {
      return {
        ...INITIAL_NCE_STATUS,
        isAvailable: false,
        statusMessage: 'Backend unreachable / Disconnected',
        macUtilization: null,
        acceleratorUtilization: null,
        temperatureC: null,
        powerEstimateWatts: null
      };
    }
  }

  async getMetricsHistory(): Promise<MetricSnapshot[]> {
    try {
      const res = await fetch(`${apiBaseUrl}/api/metrics`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch {
      return [];
    }
  }

  async runObjectDetection(
    input: DetectionInput,
    onProgress?: (stage: string, percent: number) => void
  ): Promise<DetectionResult> {
    if (onProgress) onProgress('Sending inference request to edge daemon...', 30);
    const res = await fetch(`${apiBaseUrl}/api/detection/infer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input)
    });
    if (onProgress) onProgress('Processing detection tensors...', 80);
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: `HTTP ${res.status}` }));
      throw new Error(err.detail || `HTTP ${res.status}`);
    }
    const data: DetectionResult = await res.json();
    data.isSimulated = false;
    if (onProgress) onProgress('Inference complete', 100);
    return data;
  }

  async uploadDetectionImage(
    file: File,
    modelName: string,
    backend: string,
    confidenceThreshold: number = 0.35
  ): Promise<DetectionResult> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('modelName', modelName);
    formData.append('backend', backend);
    formData.append('confidenceThreshold', confidenceThreshold.toString());

    const res = await fetch(`${apiBaseUrl}/api/detection/upload`, {
      method: 'POST',
      body: formData
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: `HTTP ${res.status}` }));
      throw new Error(err.detail || `HTTP ${res.status}`);
    }
    const data: DetectionResult = await res.json();
    data.isSimulated = false;
    return data;
  }

  async generateLLM(
    input: LLMInput,
    onToken?: (token: string, currentText: string) => void,
    onStage?: (stage: string) => void
  ): Promise<LLMResult> {
    if (onStage) onStage('Connecting to local LLM runtime...');
    const res = await fetch(`${apiBaseUrl}/api/llm/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: `HTTP ${res.status}` }));
      throw new Error(err.detail || `HTTP ${res.status}`);
    }
    const data: LLMResult = await res.json();
    data.isSimulated = false;
    if (onToken) onToken(data.text, data.text);
    return data;
  }

  async stopLLM(): Promise<void> {
    await fetch(`${apiBaseUrl}/api/llm/stop`, { method: 'POST' }).catch(() => {});
  }

  async runBenchmark(
    input: BenchmarkInput,
    onProgress?: (percent: number, currentMsg: string) => void
  ): Promise<BenchmarkResult> {
    if (onProgress) onProgress(40, `Executing real ${input.workload} benchmark on ${input.backend.toUpperCase()}...`);
    const res = await fetch(`${apiBaseUrl}/api/benchmark/run`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: `HTTP ${res.status}` }));
      throw new Error(err.detail || `HTTP ${res.status}`);
    }
    const data: BenchmarkResult = await res.json();
    data.isSimulated = false;
    return data;
  }

  async getLogs(limit: number = 100, level?: string, module?: string): Promise<LogEntry[]> {
    let url = `${apiBaseUrl}/api/logs?limit=${limit}`;
    if (level) url += `&level=${level}`;
    if (module) url += `&module=${module}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  }

  async clearLogs(): Promise<void> {
    await fetch(`${apiBaseUrl}/api/logs/clear`, { method: 'POST' }).catch(() => {});
  }

  async listDevices(): Promise<any[]> {
    const res = await fetch(`${apiBaseUrl}/api/devices`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  }

  async connectDevice(deviceId: string, params?: any): Promise<any> {
    const res = await fetch(`${apiBaseUrl}/api/devices/connect`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ deviceId, parameters: params })
    });
    return await res.json();
  }

  async disconnectDevice(deviceId: string): Promise<any> {
    const res = await fetch(`${apiBaseUrl}/api/devices/${deviceId}/disconnect`, {
      method: 'POST'
    });
    return await res.json();
  }

  async testLoopback(): Promise<any> {
    const res = await fetch(`${apiBaseUrl}/api/devices/loopback`, { method: 'POST' });
    return await res.json();
  }

  async getSettings(): Promise<any> {
    const res = await fetch(`${apiBaseUrl}/api/settings`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  }

  async updateSettings(settings: any): Promise<any> {
    const res = await fetch(`${apiBaseUrl}/api/settings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings)
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  }
}

const mockBackend = new MockAIBackend();
const realBackend = new RealAIBackend();

export const getBackend = (mode: HardwareConnectionMode): AIBackend => {
  return mode === 'hardware' ? realBackend : mockBackend;
};
export { mockBackend, realBackend };

