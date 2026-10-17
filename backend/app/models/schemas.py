"""
Pydantic Schemas for Neural Computing Architecture (NCA) Platform API.
Mirrors frontend TypeScript interfaces with strict validation.
"""
from typing import List, Optional, Dict, Any, Tuple
from pydantic import BaseModel, Field

# Hardware & System Status
class ClockFrequencies(BaseModel):
    riscvMhz: float = 1500.0
    fpgaCoreMhz: float = 100.0
    nceEngineMhz: float = 100.0
    spiBusMhz: float = 50.0

class SystemStatusResponse(BaseModel):
    host: str = "Milk-V Mars"
    processor: str = "RISC-V StarFive JH7110 (Quad-Core RV64GC)"
    processorStatus: str = "ONLINE"  # 'ONLINE' | 'OFFLINE' | 'BUSY' | 'ERROR' | 'INITIALIZING'
    fpgaModel: str = "FPGA Accelerator (Xilinx / Gowin)"
    fpgaStatus: str = "OFFLINE"       # 'ONLINE' | 'OFFLINE' | 'BUSY' | 'ERROR'
    nceState: str = "IDLE"           # 'READY' | 'ACTIVE' | 'IDLE' | 'CONFIGURING' | 'ERROR'
    runtimeStatus: str = "RUNNING"   # 'RUNNING' | 'STOPPED' | 'PAUSED'
    communicationStatus: str = "DISCONNECTED" # 'CONNECTED' | 'DISCONNECTED' | 'STANDBY' | 'TRANSMITTING'
    uptimeSeconds: int = 0
    memoryUsageMb: float = 0.0
    totalMemoryMb: float = 0.0
    cpuTemperatureC: Optional[float] = None
    fpgaTemperatureC: Optional[float] = None  # None / "N/A" if disconnected
    clockFrequencies: ClockFrequencies = Field(default_factory=ClockFrequencies)
    isHardwareConnected: bool = False
    activeBackend: str = "cpu"

class NCEBlock(BaseModel):
    id: str
    name: str
    shortName: str
    category: str  # 'control' | 'memory' | 'compute'
    status: str    # 'IDLE' | 'ACTIVE' | 'WAITING'
    activityPercentage: int
    description: str
    specs: Dict[str, str]

class NCEStatusResponse(BaseModel):
    isAvailable: bool = False
    statusMessage: str = "FPGA Hardware Disconnected"
    macUtilization: Optional[float] = None
    memoryUtilization: Optional[float] = None
    onChipMemoryUsedKb: Optional[int] = None
    onChipMemoryTotalKb: Optional[int] = None
    acceleratorUtilization: Optional[float] = None
    dataTransferRateMBps: Optional[float] = None
    clockFrequencyMhz: Optional[float] = None
    temperatureC: Optional[float] = None
    powerEstimateWatts: Optional[float] = None
    blocks: Dict[str, NCEBlock] = Field(default_factory=dict)

class MetricSnapshot(BaseModel):
    timestamp: int
    latencyMs: float
    throughputFps: float
    cpuUtilization: float
    fpgaUtilization: Optional[float] = None
    powerWatts: Optional[float] = None
    energyJoules: Optional[float] = None

# Object Detection
class DetectedObject(BaseModel):
    id: str
    label: str
    confidence: float
    bbox: List[float]  # [x, y, width, height] in percentages (0-100)
    pixelBbox: Optional[List[int]] = None
    color: Optional[str] = None

class DetectionRequest(BaseModel):
    imageSource: str  # base64 data URI, sample ID, or path
    modelName: str = "YOLOX-Nano"  # 'YOLOX-Nano' | 'YOLOv5n' | 'Tiny YOLO'
    backend: str = "cpu"           # 'cpu' | 'fpga'
    confidenceThreshold: float = 0.35

class DetectionResponse(BaseModel):
    detections: List[DetectedObject]
    totalObjects: int
    inferenceTimeMs: float
    preProcessingMs: float
    nceExecutionMs: float
    postProcessingMs: float
    fps: float
    cpuUtilization: float
    fpgaUtilization: Optional[float] = None
    energyJoules: Optional[float] = None
    backendUsed: str  # 'cpu' | 'fpga'
    tensorDimensions: str
    isSimulated: bool = False
    statusMessage: Optional[str] = None

# Tiny LLM
class LLMLoadRequest(BaseModel):
    modelPath: Optional[str] = None
    modelName: str = "Built-in Micro Transformer (INT8)"
    contextLength: int = 512
    cpuThreads: int = 4

class LLMGenerateRequest(BaseModel):
    prompt: str
    model: str = "Built-in Micro Transformer (INT8)"
    maxTokens: int = 128
    temperature: float = 0.7
    topP: float = 0.9
    backend: str = "cpu"

class LLMGenerateResponse(BaseModel):
    text: str
    tokensGenerated: int
    tokensPerSecond: float
    timeToFirstTokenMs: float
    totalGenerationTimeSec: float
    cpuUtilization: float
    fpgaUtilization: Optional[float] = None
    energyJoules: Optional[float] = None
    backendUsed: str = "cpu"
    isSimulated: bool = False

# Benchmarks
class BenchmarkRequest(BaseModel):
    workload: str  # 'Matrix Multiplication' | 'Convolution' | 'Object Detection' | 'Tiny LLM'
    backend: str   # 'cpu' | 'fpga'
    iterations: int = 5
    warmupRuns: int = 2
    matrixDimension: int = 256
    batchSize: int = 1

class BenchmarkResponse(BaseModel):
    id: str
    timestamp: str
    workload: str
    backend: str
    latencyMs: float
    minLatencyMs: float
    maxLatencyMs: float
    throughputFps: float
    cpuUtilization: float
    fpgaUtilization: Optional[float] = None
    memoryUsageMb: float
    energyJoules: Optional[float] = None
    powerWatts: Optional[float] = None
    speedupFactor: Optional[float] = None
    isSimulated: bool = False
    isAvailable: bool = True
    statusMessage: Optional[str] = None

# Device Management
class DeviceInfo(BaseModel):
    id: str
    name: str
    type: str  # 'ethernet' | 'serial' | 'spi' | 'char_device'
    address: str
    status: str  # 'AVAILABLE' | 'CONNECTED' | 'DISCONNECTED' | 'UNAVAILABLE'
    description: str
    firmwareVersion: Optional[str] = None
    driverLoaded: bool = False

class DeviceConnectRequest(BaseModel):
    deviceId: str
    parameters: Optional[Dict[str, Any]] = None

# Logging
class LogEntry(BaseModel):
    id: str
    timestamp: str
    level: str   # 'INFO' | 'NCE' | 'WARN' | 'ERROR' | 'PERF'
    module: str  # 'RUNTIME' | 'HOST' | 'COMM' | 'FPGA' | 'MODEL' | 'PERF'
    message: str

# Settings
class GeneralSettings(BaseModel):
    theme: str = "light"
    logVerbosity: str = "INFO"
    autoConnectHardware: bool = False
    telemetryIntervalMs: int = 1000

class RuntimeSettings(BaseModel):
    defaultBackend: str = "cpu"
    defaultDetectionModel: str = "YOLOX-Nano"
    confidenceThreshold: float = 0.35
    llmModelPath: str = "builtin"
    llmMaxTokens: int = 128
    llmTemperature: float = 0.7
    cpuThreads: int = 4

class HardwareSettings(BaseModel):
    connectionType: str = "network_rest"  # 'network_rest' | 'serial' | 'spi' | 'char_device'
    targetHost: str = "192.168.1.120"
    targetPort: int = 8080
    serialPort: str = "/dev/ttyUSB0"
    baudRate: int = 115200
    spiDevice: str = "/dev/spidev0.0"
    charDevice: str = "/dev/nce0"
    timeoutMs: int = 3000
    allowSimulationFallback: bool = False

class BenchmarkSettings(BaseModel):
    defaultRepetitions: int = 5
    defaultWarmupRuns: int = 2
    defaultMatrixDimension: int = 256

class AppSettings(BaseModel):
    general: GeneralSettings = Field(default_factory=GeneralSettings)
    runtime: RuntimeSettings = Field(default_factory=RuntimeSettings)
    hardware: HardwareSettings = Field(default_factory=HardwareSettings)
    benchmarks: BenchmarkSettings = Field(default_factory=BenchmarkSettings)
