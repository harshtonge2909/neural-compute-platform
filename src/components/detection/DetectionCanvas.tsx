import React, { useState } from 'react';
import { DetectedObject } from '../../types';
import { Scan, Target } from 'lucide-react';

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
    <div className="relative w-full aspect-[16/10] bg-white rounded-xl overflow-hidden border border-[#D9E2EC] shadow-xs flex items-center justify-center group">
      {/* Background Image / SVG */}
      <img
        src={imageSrc}
        alt="Inference Target"
        className="w-full h-full object-contain select-none"
      />

      {/* Sensor Info badge top left */}
      <div className="absolute top-3 left-3 flex items-center gap-2 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded border border-[#D9E2EC] text-[11px] font-sans shadow-xs z-10">
        <Scan className="w-3.5 h-3.5 text-blue-600" />
        <span className="text-[#526174] font-medium">Input Tensor</span>
        <span className="text-slate-300">|</span>
        <span className="text-blue-700 font-semibold">{detections.length} Detected</span>
      </div>

      {/* Loading & Inference Stage Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-white/85 backdrop-blur-xs flex flex-col items-center justify-center z-20 p-6">
          <div className="relative mb-4">
            <div className="w-14 h-14 rounded-full border-3 border-blue-100 border-t-blue-600 animate-spin" />
            <Target className="w-5 h-5 text-blue-600 absolute inset-0 m-auto animate-pulse" />
          </div>

          <span className="font-sans font-bold text-sm text-[#172033] tracking-wide">
            {activeStage || 'Processing accelerator tensors...'}
          </span>

          <div className="w-64 max-w-full bg-slate-200 h-2 rounded-full overflow-hidden mt-3">
            <div
              className="h-full bg-blue-600 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <span className="text-[11px] font-mono-tech text-[#526174] mt-2">
            NCE Pipeline: {progressPercent}% Completed
          </span>
        </div>
      )}

      {/* Bounding Boxes */}
      {!isLoading &&
        detections.map((det, idx) => {
          const [x, y, w, h] = det.bbox;
          const isHovered = hoveredId === det.id;
          // Primary blue, secondary green for clean technical distinction
          const boxColor = idx % 2 === 0 ? '#2563EB' : '#059669';

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
                    ? 'shadow-md bg-blue-500/10'
                    : 'bg-blue-500/5'
                }`}
                style={{ borderColor: boxColor }}
              >
                {/* Corner reticles */}
                <div className="absolute -top-1 -left-1 w-1.5 h-1.5" style={{ backgroundColor: boxColor }} />
                <div className="absolute -top-1 -right-1 w-1.5 h-1.5" style={{ backgroundColor: boxColor }} />
                <div className="absolute -bottom-1 -left-1 w-1.5 h-1.5" style={{ backgroundColor: boxColor }} />
                <div className="absolute -bottom-1 -right-1 w-1.5 h-1.5" style={{ backgroundColor: boxColor }} />
              </div>

              {/* Tag Header: clean white badge with dark text and small colored bar */}
              <div
                className="absolute -top-6 left-0 flex items-center gap-1.5 px-2 py-0.5 rounded bg-white/95 border text-[11px] font-sans font-semibold text-[#172033] shadow-xs select-none whitespace-nowrap"
                style={{ borderColor: boxColor }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full inline-block"
                  style={{ backgroundColor: boxColor }}
                />
                <span className="capitalize">{det.label}</span>
                <span className="text-[#526174] font-mono-tech font-normal">
                  {(det.confidence * 100).toFixed(1)}%
                </span>
              </div>

              {/* Coordinate info bubble on hover */}
              {isHovered && (
                <div className="absolute -bottom-6 left-0 bg-white border border-[#D9E2EC] px-1.5 py-0.5 rounded text-[10px] font-mono-tech text-[#526174] z-30 whitespace-nowrap shadow-xs">
                  [{x.toFixed(0)}, {y.toFixed(0)}, {(x + w).toFixed(0)}, {(y + h).toFixed(0)}]
                </div>
              )}
            </div>
          );
        })}
    </div>
  );
};
