import { 
  SystemStatus, 
  NCEStatus, 
  SampleImage, 
  BenchmarkResult, 
  LogEntry 
} from '../types';

export const INITIAL_SYSTEM_STATUS: SystemStatus = {
  host: 'Milk-V Mars SBC',
  processor: 'StarFive JH7110 Quad-Core (RV64GC @ 1.5 GHz)',
  processorStatus: 'ONLINE',
  fpgaModel: 'FPGA NCE-Custom Core (Xilinx Artix-7 / Gowin GW2A)',
  fpgaStatus: 'ONLINE',
  nceState: 'READY',
  runtimeStatus: 'RUNNING',
  communicationStatus: 'CONNECTED',
  uptimeSeconds: 14280, // ~3h 58m
  memoryUsageMb: 1248,
  totalMemoryMb: 8192,
  cpuTemperatureC: 43.8,
  fpgaTemperatureC: 45.2,
  clockFrequencies: {
    riscvMhz: 1500,
    fpgaCoreMhz: 125,
    nceEngineMhz: 100,
    spiBusMhz: 50,
  }
};

export const INITIAL_NCE_STATUS: NCEStatus = {
  macUtilization: 28,
  memoryUtilization: 42,
  onChipMemoryUsedKb: 430,
  onChipMemoryTotalKb: 1024,
  acceleratorUtilization: 35,
  dataTransferRateMBps: 42.8,
  clockFrequencyMhz: 100,
  temperatureC: 45.2,
  powerEstimateWatts: 4.8,
  blocks: {
    controller: {
      id: 'controller',
      name: 'Instruction & Sequence Controller',
      shortName: 'Controller',
      category: 'control',
      status: 'IDLE',
      activityPercentage: 15,
      description: 'Decodes AI runtime command frames, configures tensor tiling parameters, and dispatches compute micro-ops to arithmetic pipelines.',
      specs: {
        'Microcode Width': '64-bit',
        'Command Queue Depth': '32 descriptors',
        'Host Bus': 'SPI / AXI4-Lite Slave',
        'State Machine': 'Hardware FSM @ 100MHz'
      }
    },
    on_chip_memory: {
      id: 'on_chip_memory',
      name: 'High-Bandwidth On-Chip SRAM',
      shortName: 'On-Chip Memory',
      category: 'memory',
      status: 'IDLE',
      activityPercentage: 42,
      description: 'Ultra-low latency dual-port Block RAM serving weights and intermediate feature maps with 512-bit parallel bus to the compute array.',
      specs: {
        'Capacity': '1024 KB BRAM',
        'Bandwidth': '6.4 GB/s @ 100MHz',
        'Port Architecture': 'Dual True-Dual Port',
        'Buffering Scheme': 'Double-buffered Ping-Pong'
      }
    },
    mac_array: {
      id: 'mac_array',
      name: 'Systolic Multiply-Accumulate Array',
      shortName: 'MAC Array',
      category: 'compute',
      status: 'IDLE',
      activityPercentage: 30,
      description: '2D grid of 64x64 DSP-based multiply-accumulate processing elements executing quantized INT8 inner-product operations with zero pipeline stalls.',
      specs: {
        'Array Topology': '64x64 2D Systolic',
        'Precision': 'INT8 weights x INT8 inputs',
        'Accumulator': '32-bit INT32',
        'Peak Performance': '12.8 GOPS @ 100MHz'
      }
    },
    matrix_engine: {
      id: 'matrix_engine',
      name: 'GEMM Hardware Matrix Unit',
      shortName: 'Matrix Engine',
      category: 'compute',
      status: 'IDLE',
      activityPercentage: 25,
      description: 'Orchestrates general matrix-matrix multiplications (GEMM) for dense linear layers, projection layers, and transformer attention heads.',
      specs: {
        'Tiling Size': '32 x 32 sub-blocks',
        'Throughput': '64 MACs/cycle',
        'Dataflow': 'Weight-stationary flow',
        'Supported Operations': 'Linear, MatMul, Batched GEMM'
      }
    },
    tensor_buffer: {
      id: 'tensor_buffer',
      name: 'Input/Output Tensor Buffer',
      shortName: 'Tensor Buffer',
      category: 'memory',
      status: 'IDLE',
      activityPercentage: 38,
      description: 'Stream buffer managing DMA transfers to and from the host RISC-V memory with automatic hardware zero-padding and data alignment.',
      specs: {
        'FIFO Depth': '512 words x 128-bit',
        'DMA Interface': 'Master burst DMA',
        'Zero Padding': 'Hardware border generator',
        'Alignment': '4-byte word aligned'
      }
    },
    conv_unit: {
      id: 'conv_unit',
      name: 'Spatial Convolution Unit',
      shortName: 'Convolution Unit',
      category: 'compute',
      status: 'IDLE',
      activityPercentage: 20,
      description: 'Hardware line-buffer accelerator transforming 2D spatial convolution windows (1x1, 3x3, 5x5) into continuous streams for systolic feeds.',
      specs: {
        'Kernel Sizes': '1x1, 3x3, 5x5 supported',
        'Strides': '1, 2, 4 configurable',
        'Line Buffers': '5 parallel shift registers',
        'Dilation': 'Rate 1-2 programmable'
      }
    },
    activation_unit: {
      id: 'activation_unit',
      name: 'Nonlinear Activation Pipeline',
      shortName: 'Activation Unit',
      category: 'compute',
      status: 'IDLE',
      activityPercentage: 10,
      description: 'Pipelined mathematical lookup and piecewise-linear approximation block evaluating activation functions in single-cycle latency.',
      specs: {
        'Functions': 'ReLU, LeakyReLU (0.1), Sigmoid, SiLU',
        'Lookup Table': '256-entry piecewise interpolation',
        'Latency': '1 clock cycle per element',
        'Quantization': 'Scale & zero-point requantization'
      }
    },
    pooling_unit: {
      id: 'pooling_unit',
      name: 'Spatial Pooling & Downsampler',
      shortName: 'Pooling Unit',
      category: 'compute',
      status: 'IDLE',
      activityPercentage: 8,
      description: 'Hardware comparator and accumulator block performing Max Pooling and Average Pooling operations directly on streaming feature maps.',
      specs: {
        'Window Size': '2x2, 3x3, Global Average',
        'Stride': '2x2 downsampling',
        'Latency': 'Zero extra cycle streaming',
        'Throughput': '1 element/cycle'
      }
    }
  }
};

export const SAMPLE_IMAGES: SampleImage[] = [
  {
    id: 'sample-people',
    name: 'Urban Pedestrians (CAM-01)',
    category: 'people',
    url: '/samples/people.svg',
    description: 'City intersection surveillance feed with multiple walking pedestrians and a cyclist.',
    defaultDetections: [
      {
        id: 'det-1',
        label: 'person',
        confidence: 0.962,
        bbox: [18.7, 44.0, 11.2, 44.0], // x, y, w, h in %
        color: '#38bdf8'
      },
      {
        id: 'det-2',
        label: 'person',
        confidence: 0.938,
        bbox: [50.0, 39.0, 12.0, 48.0],
        color: '#38bdf8'
      },
      {
        id: 'det-3',
        label: 'bicycle',
        confidence: 0.894,
        bbox: [73.5, 52.0, 17.5, 36.0],
        color: '#a855f7'
      }
    ]
  },
  {
    id: 'sample-vehicles',
    name: 'Highway Traffic (CAM-04)',
    category: 'vehicles',
    url: '/samples/vehicles.svg',
    description: 'High-speed roadway perception frame for autonomous edge tracking.',
    defaultDetections: [
      {
        id: 'det-4',
        label: 'car',
        confidence: 0.968,
        bbox: [13.7, 62.0, 27.5, 24.0],
        color: '#38bdf8'
      },
      {
        id: 'det-5',
        label: 'car',
        confidence: 0.942,
        bbox: [60.0, 55.0, 31.2, 30.0],
        color: '#38bdf8'
      },
      {
        id: 'det-6',
        label: 'truck',
        confidence: 0.885,
        bbox: [46.5, 44.4, 8.2, 9.0],
        color: '#f59e0b'
      }
    ]
  },
  {
    id: 'sample-animals',
    name: 'Park Scenery (CAM-07)',
    category: 'animals',
    url: '/samples/animals.svg',
    description: 'Public park wildlife monitoring feed featuring domestic animals and birds.',
    defaultDetections: [
      {
        id: 'det-7',
        label: 'dog',
        confidence: 0.974,
        bbox: [23.7, 48.0, 26.3, 36.0],
        color: '#10b981'
      },
      {
        id: 'det-8',
        label: 'cat',
        confidence: 0.912,
        bbox: [66.2, 58.0, 11.3, 24.0],
        color: '#fbbf24'
      },
      {
        id: 'det-9',
        label: 'bird',
        confidence: 0.846,
        bbox: [78.7, 16.0, 7.5, 8.0],
        color: '#ec4899'
      }
    ]
  }
];

export interface LLMPreset {
  id: string;
  title: string;
  prompt: string;
  response: string;
  tokensCount: number;
}

export const LLM_PRESETS: LLMPreset[] = [
  {
    id: 'preset-1',
    title: 'FPGA Acceleration in Simple Terms',
    prompt: 'Explain FPGA acceleration in simple terms.',
    response: `Field-Programmable Gate Arrays (FPGAs) accelerate artificial intelligence by creating tailor-made digital circuitry directly matching the neural network's mathematical structure. 

Unlike general-purpose CPUs that execute instructions sequentially through a standard fetch-decode-execute loop, an FPGA maps thousands of Multiply-Accumulate (MAC) arithmetic operations into spatial, parallel systolic pipelines. 

In our Neural Computing Architecture:
1. Low Latency: Dedicated on-chip SRAM eliminates high-latency external DDR memory bottlenecks.
2. Energy Efficiency: Hardware runs at a modest 100 MHz clock rate while achieving high parallel throughput, consuming only ~4.8 W compared to tens of watts on GPUs.
3. Determinism: Inference timing is cycle-accurate, critical for real-time robotics and embedded object detection on the Milk-V Mars RISC-V host.`,
    tokensCount: 148
  },
  {
    id: 'preset-2',
    title: 'Matrix Multiplication for AI',
    prompt: 'What is matrix multiplication and why is it important for AI?',
    response: `General Matrix Multiply (GEMM) is the core computational primitive underlying over 85% of modern Deep Learning and Large Language Model inference workloads.

In neural networks:
• Dense Linear Layers: Compute Y = W · X + B, where W is the weight matrix and X is the activation vector.
• Attention Mechanisms: Calculate Query · Key^T and (Softmax) · Value in Transformer models.
• Convolutions: Frequently mapped to GEMM using the im2col (image-to-column) transformation.

Why dedicated hardware matters:
For an N×N matrix multiplication, traditional execution requires O(N³) arithmetic operations. Our FPGA Neural Compute Engine integrates a 64x64 Systolic MAC Array that feeds data across neighboring processing units, reusing operands on-chip and sustaining up to 12.8 GOPS with quantized INT8 arithmetic.`,
    tokensCount: 162
  },
  {
    id: 'preset-3',
    title: 'CPU vs FPGA Inference Differences',
    prompt: 'Explain the difference between CPU and FPGA inference.',
    response: `When evaluating edge AI inference on our Milk-V Mars platform, the performance and physical characteristics differ substantially:

1. Architecture Model:
• RISC-V CPU: Temporal computation using scalar registers and SIMD instructions. High clock speed (1.5 GHz) but limited concurrent arithmetic units.
• FPGA NCE: Spatial computation with dedicated DSP slices wired as a parallel systolic array.

2. Latency & Throughput:
• Tiny YOLO Object Detection: CPU execution averages ~142 ms (7.0 FPS), whereas FPGA acceleration achieves ~18.4 ms (54.3 FPS)—a 7.7x speedup.

3. Thermal & Energy Envelope:
• Running continuous inference on the CPU pushes utilization to 95%+ and generates ~0.62 Joules per frame.
• Offloading compute kernels to the FPGA drops CPU load to 28% and slashes energy consumption to 0.088 Joules per frame—delivering an 86% energy savings.`,
    tokensCount: 178
  },
  {
    id: 'preset-4',
    title: 'Neural Compute Engine Architecture',
    prompt: 'Describe the architecture of our Neural Compute Engine.',
    response: `The Neural Compute Engine (NCE) is a specialized FPGA hardware accelerator designed to partner with the Milk-V Mars RISC-V host.

The NCE consists of 8 tightly coupled microarchitectural blocks:
1. Instruction & Sequence Controller: Interprets high-level AI runtime commands and manages hardware state transitions.
2. High-Bandwidth On-Chip SRAM (1024 KB): Double-buffered ping-pong memory serving weights and tensors.
3. 64x64 Systolic MAC Array: Parallel DSP elements executing quantized INT8 multiplications.
4. GEMM Matrix Engine: Tiled linear algebra engine for dense layers and transformer projections.
5. Spatial Convolution Unit: Dedicated line-buffer engine for 1x1, 3x3, and 5x5 kernels.
6. Nonlinear Activation Pipeline: Single-cycle piecewise LUT evaluating ReLU, LeakyReLU, and SiLU.
7. Spatial Pooling Unit: Streaming Max-Pooling and Average-Pooling downsamplers.
8. Tensor Buffer & DMA Interface: Synchronizes high-speed tensor streaming with the host Linux kernel.`,
    tokensCount: 185
  }
];

export const INITIAL_LOGS: LogEntry[] = [
  {
    id: 'log-1',
    timestamp: '12:40:01.120',
    level: 'INFO',
    module: 'HOST',
    message: 'Milk-V Mars Linux 6.1.0-riscv64 booted successfully on StarFive JH7110.'
  },
  {
    id: 'log-2',
    timestamp: '12:40:02.340',
    level: 'INFO',
    module: 'COMM',
    message: 'SPI communication driver /dev/spidev0.0 initialized at 50 MHz.'
  },
  {
    id: 'log-3',
    timestamp: '12:40:02.890',
    level: 'INFO',
    module: 'FPGA',
    message: 'FPGA bitstream validated. Bitstream ID: 0x4E434502 (NCE v2.4).'
  },
  {
    id: 'log-4',
    timestamp: '12:40:03.115',
    level: 'NCE',
    module: 'FPGA',
    message: 'Neural Compute Engine handshaking complete. 64x64 MAC array online.'
  },
  {
    id: 'log-5',
    timestamp: '12:40:03.450',
    level: 'INFO',
    module: 'RUNTIME',
    message: 'AI Runtime daemon started. Model cache initialized in /opt/nca/models.'
  },
  {
    id: 'log-6',
    timestamp: '12:40:04.010',
    level: 'PERF',
    module: 'RUNTIME',
    message: 'Self-test benchmark passed: 1000 GEMM ops verified with zero bit-error.'
  }
];

export const BENCHMARK_HISTORY: BenchmarkResult[] = [
  {
    id: 'bm-1',
    timestamp: '12:35:10',
    workload: 'Object Detection',
    backend: 'cpu',
    latencyMs: 142.6,
    throughputFps: 7.0,
    cpuUtilization: 94.2,
    fpgaUtilization: 0.0,
    energyJoules: 0.620,
    powerWatts: 4.35,
    isSimulated: true
  },
  {
    id: 'bm-2',
    timestamp: '12:35:25',
    workload: 'Object Detection',
    backend: 'fpga',
    latencyMs: 18.4,
    throughputFps: 54.3,
    cpuUtilization: 29.1,
    fpgaUtilization: 81.4,
    energyJoules: 0.088,
    powerWatts: 4.80,
    speedupFactor: 7.75,
    energyEfficiencyGain: 85.8,
    isSimulated: true
  },
  {
    id: 'bm-3',
    timestamp: '12:36:00',
    workload: 'Matrix Multiplication',
    backend: 'cpu',
    latencyMs: 88.5,
    throughputFps: 11.3,
    cpuUtilization: 98.0,
    fpgaUtilization: 0.0,
    energyJoules: 0.398,
    powerWatts: 4.50,
    isSimulated: true
  },
  {
    id: 'bm-4',
    timestamp: '12:36:15',
    workload: 'Matrix Multiplication',
    backend: 'fpga',
    latencyMs: 9.8,
    throughputFps: 102.0,
    cpuUtilization: 18.5,
    fpgaUtilization: 88.6,
    energyJoules: 0.046,
    powerWatts: 4.70,
    speedupFactor: 9.03,
    energyEfficiencyGain: 88.4,
    isSimulated: true
  },
  {
    id: 'bm-5',
    timestamp: '12:37:05',
    workload: 'Convolution',
    backend: 'cpu',
    latencyMs: 112.4,
    throughputFps: 8.9,
    cpuUtilization: 92.5,
    fpgaUtilization: 0.0,
    energyJoules: 0.495,
    powerWatts: 4.40,
    isSimulated: true
  },
  {
    id: 'bm-6',
    timestamp: '12:37:20',
    workload: 'Convolution',
    backend: 'fpga',
    latencyMs: 14.1,
    throughputFps: 70.9,
    cpuUtilization: 24.0,
    fpgaUtilization: 76.5,
    energyJoules: 0.066,
    powerWatts: 4.70,
    speedupFactor: 7.97,
    energyEfficiencyGain: 86.7,
    isSimulated: true
  },
  {
    id: 'bm-7',
    timestamp: '12:38:10',
    workload: 'Tiny LLM',
    backend: 'cpu',
    latencyMs: 340.0,
    throughputFps: 2.9, // tok/s
    cpuUtilization: 99.1,
    fpgaUtilization: 0.0,
    energyJoules: 1.56,
    powerWatts: 4.60,
    isSimulated: true
  },
  {
    id: 'bm-8',
    timestamp: '12:38:30',
    workload: 'Tiny LLM',
    backend: 'fpga',
    latencyMs: 53.5,
    throughputFps: 18.7, // tok/s
    cpuUtilization: 24.3,
    fpgaUtilization: 73.2,
    energyJoules: 0.25,
    powerWatts: 4.80,
    speedupFactor: 6.35,
    energyEfficiencyGain: 84.0,
    isSimulated: true
  }
];

export interface SystemArchitectureNode {
  id: string;
  name: string;
  layer: 'Application' | 'Runtime' | 'Communication' | 'Host' | 'Physical' | 'Accelerator';
  shortDesc: string;
  badge: string;
  color: string;
  details: {
    purpose: string;
    responsibilities: string[];
    hardwareSoftware: string;
    keyInterfaces: string[];
    dataFormats: string[];
  };
}

export const ARCHITECTURE_NODES: SystemArchitectureNode[] = [
  {
    id: 'ai-app',
    name: 'AI Application Layer',
    layer: 'Application',
    shortDesc: 'Object Detection & Tiny LLM user-facing workloads and pipelines',
    badge: 'USER SPACE',
    color: '#38bdf8',
    details: {
      purpose: 'Hosts edge machine learning tasks including live bounding-box object detection (Tiny YOLO) and interactive quantized transformer inference (Tiny LLM).',
      responsibilities: [
        'Ingests camera frames, user prompts, and sensor data',
        'Dispatches high-level inference requests to AI REST API',
        'Receives tensor detections and streaming text tokens',
        'Renders bounding boxes, confidence badges, and performance telemetry'
      ],
      hardwareSoftware: 'Web UI / Native C++ / Python Client',
      keyInterfaces: ['HTTP REST / WebSocket JSON RPC', 'Video4Linux (V4L2) camera stream'],
      dataFormats: ['RGB888 416x416 tensors', 'UTF-8 Token IDs', 'Bounding Box structs']
    }
  },
  {
    id: 'ai-api',
    name: 'AI REST API Gateway',
    layer: 'Runtime',
    shortDesc: 'REST and WebSocket endpoint bridge between client and embedded runtime',
    badge: 'API LAYER',
    color: '#0ea5e9',
    details: {
      purpose: 'Exposes standardized endpoints (/api/detection/infer, /api/llm/generate, /api/system/status) isolating the UI from low-level driver details.',
      responsibilities: [
        'Endpoint routing, input validation, and request queuing',
        'Decouples client frontend from embedded hardware communication',
        'Streams token generation events and telemetry to connected dashboards',
        'Enforces execution policies and timeout protection'
      ],
      hardwareSoftware: 'Lightweight C++ Micro-HTTP / FastAPI on Linux',
      keyInterfaces: ['REST HTTP/1.1 on port 8080', 'WebSocket /ws/stream'],
      dataFormats: ['JSON request/response packets', 'Binary tensor blobs']
    }
  },
  {
    id: 'ai-runtime',
    name: 'AI Runtime & Model Manager',
    layer: 'Runtime',
    shortDesc: 'Model quantization, graph parsing, tensor scheduling, and fallback manager',
    badge: 'CORE ENGINE',
    color: '#6366f1',
    details: {
      purpose: 'The central software engine running on the RISC-V host. Parses quantized ONNX / FlatBuffer models, manages tensor memory buffers, and schedules operator execution.',
      responsibilities: [
        'Loads model weights (INT8 quantized) into pinned memory',
        'Splits compute graphs into FPGA-accelerable kernels (Conv, MatMul) and CPU fallbacks',
        'Manages tensor memory layout and tiling transformations',
        'Collects hardware execution timers, temperature, and utilization metrics'
      ],
      hardwareSoftware: 'Embedded C++ Runtime (NCA-RT v2.4) on Linux',
      keyInterfaces: ['Internal C API to Communication Layer', 'POSIX Pinned Memory Allocation'],
      dataFormats: ['INT8 Tensor Descriptors', 'Layer Execution Lists', 'Tiled Sub-matrices']
    }
  },
  {
    id: 'comm-layer',
    name: 'Hardware-Agnostic Communication Layer',
    layer: 'Communication',
    shortDesc: 'Abstracted command dispatch, DMA synchronization, and protocol transport',
    badge: 'PROTOCOL STACK',
    color: '#8b5cf6',
    details: {
      purpose: 'Provides a hardware-agnostic transport layer between the host Linux OS and the FPGA. Can run over SPI, AXI-Stream, or PCIe without modifying upper software layers.',
      responsibilities: [
        'Serializes accelerator command descriptors and weight packets',
        'Manages DMA buffer locks and interrupts / polling flags',
        'Guarantees cyclic redundancy check (CRC32) error detection',
        'Abstracts physical bus details: currently configured for 50 MHz SPI / DMA'
      ],
      hardwareSoftware: 'Linux Kernel Character Device Driver (/dev/nce0)',
      keyInterfaces: ['SPI Bus (MOSI, MISO, SCLK, CS#)', 'GPIO Interrupt Lines (IRQ_READY, IRQ_ERR)'],
      dataFormats: ['64-bit Command Descriptors', 'CRC32-Protected Payload Packets']
    }
  },
  {
    id: 'milkv-mars',
    name: 'Milk-V Mars Host SBC',
    layer: 'Host',
    shortDesc: 'StarFive JH7110 Quad-Core RISC-V RV64GC (1.5 GHz) running Linux',
    badge: 'RISC-V HOST',
    color: '#ec4899',
    details: {
      purpose: 'The central physical embedded single-board computer orchestrating the overall platform, hosting Linux, and managing peripheral devices.',
      responsibilities: [
        'Runs mainline Linux kernel (Debian/Fedora RISC-V port)',
        'Executes preprocessing (image resizing, normalization) and postprocessing (NMS, token decoding)',
        'Supplies power and clock synchronizations to the FPGA daughterboard',
        'Serves the web dashboard and networking interfaces'
      ],
      hardwareSoftware: 'Milk-V Mars Credit-Card Sized SBC (StarFive JH7110 Quad-Core RV64GC, 8GB LPDDR4)',
      keyInterfaces: ['40-pin GPIO Header', 'Gigabit Ethernet', 'USB 3.0 / PCIe 2.0'],
      dataFormats: ['Linux System Calls', 'Standard POSIX File Descriptors']
    }
  },
  {
    id: 'fpga-nce',
    name: 'FPGA Neural Compute Engine (NCE)',
    layer: 'Accelerator',
    shortDesc: 'Custom FPGA hardware accelerator with 64x64 Systolic MAC Array & On-Chip SRAM',
    badge: 'CUSTOM SILICON',
    color: '#10b981',
    details: {
      purpose: 'The dedicated digital logic AI accelerator synthesised on FPGA. Delivers orders-of-magnitude higher energy efficiency than CPU compute by exploiting spatial parallelism.',
      responsibilities: [
        'Executes 64x64 Systolic Array quantized INT8 Multiply-Accumulate operations',
        'Performs on-the-fly 2D spatial convolution and line buffering',
        'Computes single-cycle nonlinear activations (ReLU, LeakyReLU, SiLU)',
        'Maintains high-bandwidth double-buffered ping-pong on-chip memory'
      ],
      hardwareSoftware: 'Verilog / SystemVerilog RTL on FPGA (100 MHz Engine Clock)',
      keyInterfaces: ['Dedicated Controller Bus', 'Dual-Port BRAM Ports', 'Hardware Status Flags'],
      dataFormats: ['Quantized INT8 Activations & Weights', '32-bit Accumulator Output']
    }
  }
];
