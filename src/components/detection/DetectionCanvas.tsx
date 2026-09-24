import React, { useState } from 'react';
import { DetectedObject } from '../../types';
import { Eye, Scan, Target } from 'lucide-react';

interface DetectionCanvasProps {
  imageSrc: string;
  detections: DetectedObject[];
  isLoading: boolean;
  activeStage?: string;
  progressPercent?: number;
}

export const DetectionCanvas: React.FC<DetectionCanvasProps> = ({
  imageSrc,
  detections,
  isLoading,
  activeStage,
  progressPercent = 0,
}) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div className="relative w-full aspect-[16/10] bg-slate-950 rounded-xl overflow-hidden border border-slate-800 shadow-2xl flex items-center justify-center group">
      {/* Background Image / SVG */}
      <img
        src={imageSrc}
        alt="Inference Target"
        className="w-full h-full object-contain select-none"
      />

      {/* Grid Overlay */}
      <div className="absolute inset-0 pointer-events-none terminal-grid opacity-30" />

      {/* Target Crosshair & Corner Reticles */}
      <div className="absolute inset-4 pointer-events-none border border-slate-700/30">
        <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-cyan-400" />
        <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-cyan-400" />
        <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-cyan-400" />
        <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-cyan-400" />
      </div>

      {/* HUD Info top left */}
      <div className="absolute top-3 left-3 flex items-center gap-2 bg-slate-950/80 backdrop-blur-xs px-2.5 py-1 rounded border border-slate-800 text-[11px] font-mono-tech z-10">
        <Scan className="w-3.5 h-3.5 text-cyan-400" />
        <span className="text-slate-300">SENSOR: TENSOR_IN</span>
        <span className="text-slate-400">|</span>
        <span className="text-cyan-400 font-semibold">{detections.length} OBJECTS</span>
      </div>

      {/* Loading & Inference Stage Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-[#070a12]/80 backdrop-blur-xs flex flex-col items-center justify-center z-20 p-6">
          <div className="relative mb-4">
            <div className="w-16 h-16 rounded-full border-2 border-cyan-500/20 border-t-cyan-400 animate-spin" />
            <Target className="w-6 h-6 text-cyan-400 absolute inset-0 m-auto animate-pulse" />
          </div>

          <span className="font-mono-tech font-bold text-sm text-cyan-300 tracking-wider">
            {activeStage || 'PROCESSING ACCELERATOR TENSORS...'}
          </span>

          <div className="w-64 max-w-full bg-slate-900 h-2 rounded-full overflow-hidden mt-3 border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <span className="text-[11px] font-mono-tech text-slate-400 mt-2">
            NCE Pipeline: {progressPercent}% Completed
          </span>
        </div>
      )}

      {/* Bounding Boxes */}
      {!isLoading &&
        detections.map((det) => {
          const [x, y, w, h] = det.bbox;
          const isHovered = hoveredId === det.id;
          const boxColor = det.color || '#38bdf8';

          return (
            <div
              key={det.id}
              onMouseEnter={() => setHoveredId(det.id)}
              onMouseLeave={() => setHoveredId(null)}
              className="absolute transition-all duration-150 cursor-pointer pointer-events-auto"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                width: `${w}%`,
                height: `${h}%`,
              }}
            >
              {/* Outer Bounding Box Border */}
              <div
                className={`w-full h-full border-2 transition-all ${
                  isHovered
                    ? 'border-white shadow-[0_0_15px_rgba(255,255,255,0.6)] bg-cyan-500/10'
                    : 'border-cyan-400 shadow-[0_0_8px_rgba(56,189,248,0.4)] bg-cyan-500/5'
                }`}
                style={{ borderColor: isHovered ? '#ffffff' : boxColor }}
              >
                {/* Corner reticles */}
                <div className="absolute -top-1 -left-1 w-2 h-2 bg-cyan-400" style={{ backgroundColor: boxColor }} />
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-cyan-400" style={{ backgroundColor: boxColor }} />
                <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-cyan-400" style={{ backgroundColor: boxColor }} />
                <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-cyan-400" style={{ backgroundColor: boxColor }} />
              </div>

              {/* Tag Header */}
              <div
                className="absolute -top-6 left-0 flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono-tech font-bold text-slate-950 uppercase shadow-md select-none whitespace-nowrap"
                style={{ backgroundColor: boxColor }}
              >
                <span>{det.label}</span>
                <span className="opacity-90 font-semibold">
                  {(det.confidence * 100).toFixed(1)}%
                </span>
              </div>

              {/* Coordinate info bubble on hover */}
              {isHovered && (
                <div className="absolute -bottom-6 left-0 bg-slate-950/90 border border-slate-700 px-1.5 py-0.5 rounded text-[10px] font-mono-tech text-slate-300 z-30 whitespace-nowrap">
                  [{x.toFixed(0)}, {y.toFixed(0)}, {(x + w).toFixed(0)}, {(y + h).toFixed(0)}]
                </div>
              )}
            </div>
          );
        })}
    </div>
  );
};
