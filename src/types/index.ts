// Core type definitions for Neural Computing Architecture (NCA) Platform

export type HardwareConnectionMode = 'simulation' | 'hardware';

export type SystemStatusState = 'ONLINE' | 'OFFLINE' | 'BUSY' | 'ERROR' | 'INITIALIZING';
export type AcceleratorState = 'READY' | 'ACTIVE' | 'IDLE' | 'CONFIGURING' | 'ERROR';
export type CommunicationState = 'CONNECTED' | 'DISCONNECTED' | 'STANDBY' | 'TRANSMITTING';

export interface SystemStatus {
  host: string;              // "Milk-V Mars"
  processor: string;         // "RISC-V StarFive JH7110 (Quad-Core RV64GC)"
  processorStatus: SystemStatusState;
  fpgaModel: string;         // "FPGA Accelerator (Xilinx / Gowin)"
  fpgaStatus: SystemStatusState;
  nceState: AcceleratorState;
  runtimeStatus: 'RUNNING' | 'STOPPED' | 'PAUSED';
  communicationStatus: CommunicationState;
  uptimeSeconds: number;
  memoryUsageMb: number;
  totalMemoryMb: number;
  cpuTemperatureC: number;
  fpgaTemperatureC: number;
  clockFrequencies: {
    riscvMhz: number;
    fpgaCoreMhz: number;
    nceEngineMhz: number;
    spiBusMhz: number;
  };
}

export interface MetricSnapshot {
  timestamp: number;
  latencyMs: number;
  throughputFps: number;
  cpuUtilization: number;
  fpgaUtilization: number;
  powerWatts: number;
  energyJoules: number;
}

export type BlockStatus = 'IDLE' | 'ACTIVE' | 'WAITING';

export interface NCEBlock {
  id: string;
  name: string;
  shortName: string;
  category: 'control' | 'memory' | 'compute';
  status: BlockStatus;
  activityPercentage: number;
  description: string;
  specs: Record<string, string>;
}

export interface NCEStatus {
  macUtilization: number;          // 0 - 100%
  memoryUtilization: number;       // 0 - 100%
  onChipMemoryUsedKb: number;      // e.g. 512 KB
  onChipMemoryTotalKb: number;     // e.g. 1024 KB
  acceleratorUtilization: number;  // 0 - 100%
  dataTransferRateMBps: number;    // e.g. 42.5 MB/s
  clockFrequencyMhz: number;       // e.g. 100 MHz
  temperatureC: number;            // e.g. 44.5 °C
  powerEstimateWatts: number;      // e.g. 4.6 W
  blocks: Record<string, NCEBlock>;
}

export interface BoundingBox {
  x: number;       // normalized percentage 0-100
  y: number;
  width: number;
  height: number;
}

export interface DetectedObject {
  id: string;
  label: string;
  confidence: number;
  bbox: [number, number, number, number]; // [x, y, width, height] in percentages
  pixelBbox?: [number, number, number, number];
  color?: string;
}

export interface DetectionInput {
  imageSource: string; // URL, base64 or sample identifier
  modelName: 'Tiny YOLO' | 'YOLOv8-Nano' | 'Lightweight Custom Detector';
  backend: 'cpu' | 'fpga';
  confidenceThreshold?: number;
}

export interface DetectionResult {
  detections: DetectedObject[];
  totalObjects: number;
  inferenceTimeMs: number;
  preProcessingMs: number;
  nceExecutionMs: number;
  postProcessingMs: number;
  fps: number;
  cpuUtilization: number;
  fpgaUtilization: number;
  energyJoules: number;
  backendUsed: 'cpu' | 'fpga';
  tensorDimensions: string;
  isSimulated: boolean;
}

export interface LLMInput {
  prompt: string;
  model: 'TinyLlama-1.1B' | 'Custom Tiny LLM (INT8)' | 'Lightweight Transformer';
  maxTokens?: number;
  temperature?: number;
}

export interface LLMResult {
  text: string;
  tokensGenerated: number;
  tokensPerSecond: number;
  timeToFirstTokenMs: number;
  totalGenerationTimeSec: number;
  cpuUtilization: number;
  fpgaUtilization: number;
  energyJoules: number;
  isSimulated: boolean;
}

export interface LLMStreamToken {
  token: string;
  tokenIndex: number;
  isCompleted: boolean;
  metrics?: LLMResult;
}

export type WorkloadType = 'Object Detection' | 'Matrix Multiplication' | 'Convolution' | 'Tiny LLM';
export type BackendTarget = 'cpu' | 'fpga';

export interface BenchmarkInput {
  workload: WorkloadType;
  backend: BackendTarget;
  iterations?: number;
  matrixDimension?: number;
  batchSize?: number;
}

export interface BenchmarkResult {
  id: string;
  timestamp: string;
  workload: WorkloadType;
  backend: BackendTarget;
  latencyMs: number;
  throughputFps: number;
  cpuUtilization: number;
  fpgaUtilization: number;
  energyJoules: number;
  powerWatts: number;
  speedupFactor?: number;
  energyEfficiencyGain?: number;
  isSimulated: boolean;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  level: 'INFO' | 'NCE' | 'WARN' | 'ERROR' | 'PERF';
  module: 'RUNTIME' | 'HOST' | 'COMM' | 'FPGA' | 'MODEL' | 'PERF';
  message: string;
}

export interface AIBackend {
  getSystemStatus(): Promise<SystemStatus>;
  getNCEStatus(): Promise<NCEStatus>;
  getMetricsHistory(): Promise<MetricSnapshot[]>;
  runObjectDetection(
    input: DetectionInput, 
    onProgress?: (stage: string, percent: number) => void
  ): Promise<DetectionResult>;
  generateLLM(
    input: LLMInput, 
    onToken?: (token: string, currentText: string) => void, 
    onStage?: (stage: string) => void
  ): Promise<LLMResult>;
  runBenchmark(
    input: BenchmarkInput, 
    onProgress?: (percent: number, currentMsg: string) => void
  ): Promise<BenchmarkResult>;
  getLogs(): Promise<LogEntry[]>;
}

export interface SampleImage {
  id: string;
  name: string;
  category: 'people' | 'vehicles' | 'animals';
  url: string;
  description: string;
  defaultDetections: DetectedObject[];
}
