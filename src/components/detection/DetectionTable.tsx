import React from 'react';
import { DetectedObject } from '../../types';
import { Target } from 'lucide-react';

interface DetectionTableProps {
  detections: DetectedObject[];
}

export const DetectionTable: React.FC<DetectionTableProps> = ({ detections }) => {
  return (
    <div className="bg-white rounded-xl p-5 border border-[#D9E2EC] shadow-xs space-y-3 font-sans">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-blue-600" />
          <h3 className="font-bold text-[#172033] text-sm tracking-tight">
            Detected Objects Summary
          </h3>
        </div>
        <span className="text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded">
          {detections.length} Classified
        </span>
      </div>

      {detections.length === 0 ? (
        <div className="py-6 text-center text-[#718096] text-xs">
          No detections available. Run inference on an image to populate bounding boxes.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#D9E2EC] text-[11px] text-[#526174] font-semibold uppercase bg-[#F8FAFC]">
                <th className="py-2.5 px-3">Class</th>
                <th className="py-2.5 px-3">Confidence</th>
                <th className="py-2.5 px-3">Bounding Box [X, Y, W, H] (%)</th>
                <th className="py-2.5 px-3 text-right">Pixel Coords (Norm)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {detections.map((det, idx) => {
                const [x, y, w, h] = det.bbox;
                const pxX1 = Math.round(x * 19.2);
                const pxY1 = Math.round(y * 10.8);
                const pxX2 = Math.round((x + w) * 19.2);
                const pxY2 = Math.round((y + h) * 10.8);
                const dotColor = idx % 2 === 0 ? '#2563EB' : '#059669';

                return (
                  <tr key={det.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-2.5 px-3 flex items-center gap-2 font-medium text-[#172033]">
                      <span
                        className="w-2 h-2 rounded-full inline-block"
                        style={{ backgroundColor: dotColor }}
                      />
                      <span className="capitalize">{det.label}</span>
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-slate-200 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-blue-600 h-full rounded-full"
                            style={{ width: `${det.confidence * 100}%` }}
                          />
                        </div>
                        <span className="text-[#172033] font-mono-tech font-semibold">
                          {(det.confidence * 100).toFixed(1)}%
                        </span>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-[#526174] font-mono-tech">
                      [{x.toFixed(1)}%, {y.toFixed(1)}%, {w.toFixed(1)}%, {h.toFixed(1)}%]
                    </td>
                    <td className="py-2.5 px-3 text-right text-[#526174] font-mono-tech">
                      {pxX1}, {pxY1}, {pxX2}, {pxY2}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
