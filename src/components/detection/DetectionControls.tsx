import React from 'react';
import { 
  Play, 
  Cpu, 
  Zap, 
  Upload, 
  Camera, 
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
    <div className="bg-white rounded-xl p-5 border border-[#D9E2EC] shadow-xs space-y-4 font-sans">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-blue-600" />
          <h3 className="font-bold text-[#172033] text-sm tracking-tight">
            Inference Configuration
          </h3>
        </div>
        <span className="text-[11px] font-mono-tech text-[#718096]">
          NCA-RT v2.4
        </span>
      </div>

      {/* Model Selection */}
      <div>
        <label className="text-xs font-semibold text-[#172033] block mb-1.5">
          Detection Model
        </label>
        <select
          value={selectedModel}
          onChange={(e) => onSelectModel(e.target.value as any)}
          disabled={isLoading}
          className="w-full bg-white border border-[#D9E2EC] rounded-lg px-3 py-2 text-xs text-[#172033] focus:outline-none focus:border-blue-500 cursor-pointer disabled:opacity-50 font-sans"
        >
          <option value="Tiny YOLO">Tiny YOLO (416×416, INT8 Quantized)</option>
          <option value="YOLOv8-Nano">YOLOv8-Nano (Lightweight Detector, INT8)</option>
          <option value="Lightweight Custom Detector">Lightweight Custom NCE Detector</option>
        </select>
      </div>

      {/* Execution Target: CPU Only vs FPGA Accelerated */}
      <div>
        <label className="text-xs font-semibold text-[#172033] block mb-1.5">
          Compute Backend
        </label>
        <div className="grid grid-cols-2 gap-2">
          {/* CPU Only */}
          <button
            type="button"
            onClick={() => onSelectBackend('cpu')}
            disabled={isLoading}
            className={`p-3 rounded-lg border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
              selectedBackend === 'cpu'
                ? 'bg-slate-100 border-slate-400 text-[#172033] font-semibold'
                : 'bg-white border-[#D9E2EC] text-[#526174] hover:bg-slate-50'
            }`}
          >
            <Cpu className="w-4 h-4 text-slate-700 mt-0.5 shrink-0" />
            <div>
              <span className="font-sans font-bold text-xs block">CPU Only</span>
              <span className="text-[10px] text-[#718096] block">
                JH7110 Quad-Core
              </span>
            </div>
          </button>

          {/* FPGA Accelerated */}
          <button
            type="button"
            onClick={() => onSelectBackend('fpga')}
            disabled={isLoading}
            className={`p-3 rounded-lg border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
              selectedBackend === 'fpga'
                ? 'bg-blue-50 border-blue-400 text-blue-900 font-semibold'
                : 'bg-white border-[#D9E2EC] text-[#526174] hover:bg-slate-50'
            }`}
          >
            <Zap className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
            <div>
              <span className="font-sans font-bold text-xs block">FPGA Accelerated</span>
              <span className="text-[10px] text-blue-700 block">
                NCE 64×64 Array
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* Sample Image selector */}
      <div>
        <label className="text-xs font-semibold text-[#172033] block mb-1.5">
          Pre-Loaded Demo Samples (Offline Ready)
        </label>
        <div className="grid grid-cols-3 gap-2">
          {SAMPLE_IMAGES.map((sample) => (
            <button
              key={sample.id}
              onClick={() => onSelectSample(sample)}
              disabled={isLoading}
              className={`p-2 rounded-lg border text-left transition-all cursor-pointer ${
                selectedSampleId === sample.id
                  ? 'bg-blue-50 border-blue-400 text-blue-900 font-semibold'
                  : 'bg-[#F8FAFC] border-[#D9E2EC] text-[#526174] hover:border-slate-300'
              }`}
            >
              <span className="block text-[11px] font-sans truncate">
                {sample.name.split(' ')[0]}
              </span>
              <span className="text-[10px] text-[#718096] capitalize block font-normal">
                {sample.category}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Custom Upload & Webcam options */}
      <div className="grid grid-cols-2 gap-2 pt-1">
        <label className="flex items-center justify-center gap-1.5 p-2 rounded-lg bg-white border border-[#D9E2EC] hover:bg-slate-50 text-[#172033] text-xs font-medium cursor-pointer transition-colors">
          <Upload className="w-3.5 h-3.5 text-blue-600" />
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
          className="flex items-center justify-center gap-1.5 p-2 rounded-lg bg-white border border-[#D9E2EC] hover:bg-slate-50 text-[#172033] text-xs font-medium transition-colors cursor-pointer disabled:opacity-50"
        >
          <Camera className="w-3.5 h-3.5 text-blue-600" />
          <span>Camera Feed</span>
        </button>
      </div>

      {/* Main Run Inference Button */}
      <div className="pt-2">
        <button
          onClick={onRunInference}
          disabled={isLoading}
          className={`w-full py-2.5 px-4 rounded-lg font-sans font-semibold text-xs tracking-wide flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs ${
            isLoading
              ? 'bg-slate-200 text-slate-500 cursor-not-allowed border border-slate-300'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {isLoading ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-slate-400 border-t-blue-600 rounded-full animate-spin" />
              <span>{activeStage || 'Executing inference...'}</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Run Inference ({selectedBackend.toUpperCase()})</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
