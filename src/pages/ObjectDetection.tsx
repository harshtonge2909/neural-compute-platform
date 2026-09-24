import React, { useState } from 'react';
import { useSystem } from '../context/SystemContext';
import { SAMPLE_IMAGES } from '../data/mockData';
import { SampleImage, DetectionResult } from '../types';
import { getBackend } from '../services/api';
import { DetectionCanvas } from '../components/detection/DetectionCanvas';
import { DetectionControls } from '../components/detection/DetectionControls';
import { DetectionMetrics } from '../components/detection/DetectionMetrics';
import { DetectionTable } from '../components/detection/DetectionTable';
import { DetectionComparison } from '../components/detection/DetectionComparison';
import { RuntimeLog } from '../components/common/RuntimeLog';

export const ObjectDetection: React.FC = () => {
  const { hardwareMode, addLog, triggerNCEPulse, setIsInferring } = useSystem();

  const [currentSample, setCurrentSample] = useState<SampleImage>(SAMPLE_IMAGES[0]);
  const [currentImageSrc, setCurrentImageSrc] = useState<string>(SAMPLE_IMAGES[0].url);
  const [model, setModel] = useState<'Tiny YOLO' | 'YOLOv8-Nano' | 'Lightweight Custom Detector'>('Tiny YOLO');
  const [backend, setBackend] = useState<'cpu' | 'fpga'>('fpga');

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeStage, setActiveStage] = useState<string>('');
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [detectionResult, setDetectionResult] = useState<DetectionResult>({
    detections: SAMPLE_IMAGES[0].defaultDetections,
    totalObjects: SAMPLE_IMAGES[0].defaultDetections.length,
    inferenceTimeMs: 18.4,
    preProcessingMs: 2.1,
    nceExecutionMs: 13.8,
    postProcessingMs: 2.5,
    fps: 54.3,
    cpuUtilization: 29,
    fpgaUtilization: 81,
    energyJoules: 0.088,
    backendUsed: 'fpga',
    tensorDimensions: '1 x 3 x 416 x 416 (INT8)',
    isSimulated: true,
  });

  const handleSelectSample = (sample: SampleImage) => {
    setCurrentSample(sample);
    setCurrentImageSrc(sample.url);
    setDetectionResult((prev: DetectionResult) => ({
      ...prev,
      detections: sample.defaultDetections,
      totalObjects: sample.defaultDetections.length,
    }));
    addLog('MODEL', 'INFO', `Sample feed selected: ${sample.name}`);
  };

  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setCurrentImageSrc(e.target.result as string);
        addLog('RUNTIME', 'INFO', `User image uploaded: ${file.name} (${Math.round(file.size / 1024)} KB)`);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleWebcam = () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
          addLog('RUNTIME', 'INFO', 'Webcam video stream attached to V4L2 pipeline');
          alert('Webcam stream connected to virtual V4L2 capture device /dev/video0.');
          stream.getTracks().forEach(t => t.stop());
        })
        .catch(() => {
          addLog('RUNTIME', 'WARN', 'Camera permission denied or camera device unavailable');
          alert('Camera permission denied or device not detected. Using preloaded high-resolution samples.');
        });
    } else {
      alert('Browser media capture API not supported in this context.');
    }
  };

  const handleRunInference = async () => {
    setIsLoading(true);
    setIsInferring(true);
    setProgressPercent(10);
    setActiveStage('Initializing runtime...');

    addLog('RUNTIME', 'INFO', `Starting inference request: Model=${model}, Backend=${backend.toUpperCase()}`);

    if (backend === 'fpga') {
      triggerNCEPulse(['controller', 'on_chip_memory', 'mac_array', 'conv_unit', 'activation_unit']);
    }

    try {
      const api = getBackend(hardwareMode);
      const res = await api.runObjectDetection(
        {
          imageSource: currentImageSrc,
          modelName: model,
          backend: backend,
        },
        (stage: string, pct: number) => {
          setActiveStage(stage);
          setProgressPercent(pct);
          addLog(backend === 'fpga' ? 'FPGA' : 'HOST', 'INFO', stage);
        }
      );

      setDetectionResult(res);
      addLog('PERF', 'PERF', `Inference finished: Latency=${res.inferenceTimeMs}ms, FPS=${res.fps}, Energy=${res.energyJoules}J`);
    } catch (err: any) {
      addLog('RUNTIME', 'ERROR', `Inference failed: ${err.message}`);
    } finally {
      setIsLoading(false);
      setIsInferring(false);
      setProgressPercent(0);
      setActiveStage('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-100 font-mono-tech tracking-tight">
              OBJECT DETECTION
            </h1>
            <span className="text-xs px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 font-mono-tech font-bold">
              FPGA SYSTOLIC PIPELINE
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            FPGA-Accelerated Neural Network Inference with Bounding Box Localization
          </p>
        </div>

        <div className="text-xs font-mono-tech text-slate-400">
          Current Image: <strong className="text-slate-200">{currentSample.name}</strong>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Detection Canvas Preview */}
        <div className="lg:col-span-7 space-y-4">
          <DetectionCanvas
            imageSrc={currentImageSrc}
            detections={detectionResult.detections}
            isLoading={isLoading}
            activeStage={activeStage}
            progressPercent={progressPercent}
          />

          {/* Detected Objects Table */}
          <DetectionTable detections={detectionResult.detections} />
        </div>

        {/* Right: Controls & Performance Metrics */}
        <div className="lg:col-span-5 space-y-6">
          <DetectionControls
            selectedModel={model}
            onSelectModel={setModel}
            selectedBackend={backend}
            onSelectBackend={setBackend}
            onRunInference={handleRunInference}
            isLoading={isLoading}
            activeStage={activeStage}
            onSelectSample={handleSelectSample}
            selectedSampleId={currentSample.id}
            onFileUpload={handleFileUpload}
            onWebcamClick={handleWebcam}
          />

          <DetectionMetrics result={detectionResult} isLoading={isLoading} />
        </div>
      </div>

      {/* CPU vs FPGA Comparison Section */}
      <DetectionComparison />

      {/* Embedded Runtime Log */}
      <RuntimeLog maxHeight="max-h-48" title="Inference Pipeline Log Stream" />
    </div>
  );
};
