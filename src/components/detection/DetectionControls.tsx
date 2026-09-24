import React from 'react';
import { 
  Play, 
  Cpu, 
  Zap, 
  Upload, 
  Camera, 
  Sparkles,
  Sliders
} from 'lucide-react';
import { SAMPLE_IMAGES } from '../../data/mockData';
import { SampleImage } from '../../types';

interface DetectionControlsProps {
  selectedModel: 'Tiny YOLO' | 'YOLOv8-Nano' | 'Lightweight Custom Detector';
  onSelectModel: (m: 'Tiny YOLO' | 'YOLOv8-Nano' | 'Lightweight Custom Detector') => void;
  selectedBackend: 'cpu' | 'fpga';
  onSelectBackend: (b: 'cpu' | 'fpga') => void;
  onRunInference: () => void;
  isLoading: boolean;
  activeStage?: string;
  onSelectSample: (sample: SampleImage) => void;
  selectedSampleId: string;
  onFileUpload: (file: File) => void;
  onWebcamClick: () => void;
}

export const DetectionControls: React.FC<DetectionControlsProps> = ({
  selectedModel,
  onSelectModel,
  selectedBackend,
  onSelectBackend,
  onRunInference,
  isLoading,
  activeStage,
  onSelectSample,
  selectedSampleId,
  onFileUpload,
  onWebcamClick,
}) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileUpload(e.target.files[0]);
    }
  };

  return (
    <div className="tech-card rounded-xl p-5 border border-slate-800 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-cyan-400" />
          <h3 className="font-bold text-slate-100 text-sm font-mono-tech tracking-wider">
            INFERENCE CONFIGURATION
          </h3>
        </div>
        <span className="text-[10px] font-mono-tech text-slate-400">
          NCA-RUNTIME v2.4
        </span>
      </div>

      {/* Model Selection */}
      <div>
        <label className="text-xs font-mono-tech text-slate-300 block mb-1.5 font-medium">
          DETECTION MODEL
        </label>
        <select
          value={selectedModel}
          onChange={(e) => onSelectModel(e.target.value as any)}
          disabled={isLoading}
          className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-2 text-xs font-mono-tech text-slate-200 focus:outline-none focus:border-cyan-500 cursor-pointer disabled:opacity-50"
        >
          <option value="Tiny YOLO">Tiny YOLO (416x416, INT8 Quantized)</option>
          <option value="YOLOv8-Nano">YOLOv8-Nano (Lightweight Detector, INT8)</option>
          <option value="Lightweight Custom Detector">Lightweight Custom NCE Detector</option>
        </select>
      </div>

      {/* Execution Target: CPU Only vs FPGA Accelerated */}
      <div>
        <label className="text-xs font-mono-tech text-slate-300 block mb-1.5 font-medium">
          COMPUTE BACKEND
        </label>
        <div className="grid grid-cols-2 gap-2">
          {/* CPU Only */}
          <button
            type="button"
            onClick={() => onSelectBackend('cpu')}
            disabled={isLoading}
            className={`p-3 rounded-lg border text-left flex items-start gap-2.5 transition-all ${
              selectedBackend === 'cpu'
                ? 'bg-amber-950/60 border-amber-500/80 text-amber-200 shadow-[0_0_12px_rgba(245,158,11,0.2)]'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <Cpu className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
            <div>
              <span className="font-mono-tech font-bold text-xs block">CPU Only</span>
              <span className="text-[10px] text-slate-400 font-mono-tech block">
                JH7110 Quad-Core RV64GC
              </span>
            </div>
          </button>

          {/* FPGA Accelerated */}
          <button
            type="button"
            onClick={() => onSelectBackend('fpga')}
            disabled={isLoading}
            className={`p-3 rounded-lg border text-left flex items-start gap-2.5 transition-all ${
              selectedBackend === 'fpga'
                ? 'bg-emerald-950/60 border-emerald-500/80 text-emerald-200 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <Zap className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
            <div>
              <span className="font-mono-tech font-bold text-xs block">FPGA Accelerated</span>
              <span className="text-[10px] text-emerald-400/80 font-mono-tech block">
                NCE 64x64 Systolic Array
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* Sample Image selector */}
      <div>
        <label className="text-xs font-mono-tech text-slate-300 block mb-1.5 font-medium">
          PRE-LOADED DEMO SAMPLES (OFFLINE READY)
        </label>
        <div className="grid grid-cols-3 gap-2">
          {SAMPLE_IMAGES.map((sample) => (
            <button
              key={sample.id}
              onClick={() => onSelectSample(sample)}
              disabled={isLoading}
              className={`p-2 rounded border text-left transition-all ${
                selectedSampleId === sample.id
                  ? 'bg-cyan-950/70 border-cyan-500 text-cyan-300'
                  : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <span className="block font-mono-tech text-[11px] font-semibold truncate">
                {sample.name.split(' ')[0]}
              </span>
              <span className="text-[9px] text-slate-400 capitalize block">
                {sample.category}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Custom Upload & Webcam options */}
      <div className="grid grid-cols-2 gap-2 pt-1">
        <label className="flex items-center justify-center gap-1.5 p-2 rounded bg-slate-900 border border-slate-700/80 hover:border-cyan-500 text-slate-300 hover:text-cyan-300 text-xs font-mono-tech cursor-pointer transition-colors">
          <Upload className="w-3.5 h-3.5" />
          <span>Upload Image</span>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            disabled={isLoading}
          />
        </label>

        <button
          onClick={onWebcamClick}
          disabled={isLoading}
          className="flex items-center justify-center gap-1.5 p-2 rounded bg-slate-900 border border-slate-700/80 hover:border-cyan-500 text-slate-300 hover:text-cyan-300 text-xs font-mono-tech transition-colors disabled:opacity-50"
        >
          <Camera className="w-3.5 h-3.5" />
          <span>Camera Feed</span>
        </button>
      </div>

      {/* Main Run Inference Button */}
      <div className="pt-2">
        <button
          onClick={onRunInference}
          disabled={isLoading}
          className={`w-full py-3 px-4 rounded-lg font-mono-tech font-bold text-xs tracking-wider flex items-center justify-center gap-2 transition-all ${
            isLoading
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
              : selectedBackend === 'fpga'
              ? 'bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-white shadow-[0_0_20px_rgba(6,182,212,0.4)] border border-cyan-400/50'
              : 'bg-amber-600 hover:bg-amber-500 text-white shadow-[0_0_15px_rgba(217,119,6,0.3)] border border-amber-400/50'
          }`}
        >
          {isLoading ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-slate-400 border-t-white rounded-full animate-spin" />
              <span>{activeStage || 'EXECUTING INFERENCE...'}</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-white" />
              <span>RUN INFERENCE ({selectedBackend.toUpperCase()})</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
