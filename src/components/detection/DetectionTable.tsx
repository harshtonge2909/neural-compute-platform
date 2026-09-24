import React from 'react';
import { DetectedObject } from '../../types';
import { Target, Layers } from 'lucide-react';

interface DetectionTableProps {
  detections: DetectedObject[];
}

export const DetectionTable: React.FC<DetectionTableProps> = ({ detections }) => {
  return (
    <div className="tech-card rounded-xl p-5 border border-slate-800 space-y-3">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-cyan-400" />
          <h3 className="font-bold text-slate-100 text-sm font-mono-tech tracking-wider">
            DETECTED OBJECTS SUMMARY
          </h3>
        </div>
        <span className="text-xs font-mono-tech font-bold text-cyan-400 bg-cyan-950/60 border border-cyan-800/40 px-2 py-0.5 rounded">
          {detections.length} CLASSIFIED
        </span>
      </div>

      {detections.length === 0 ? (
        <div className="py-6 text-center text-slate-400 text-xs font-mono-tech">
          No detections available. Run inference on an image to populate bounding boxes.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono-tech text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] text-slate-400 uppercase">
                <th className="py-2 px-3">Class</th>
                <th className="py-2 px-3">Confidence</th>
                <th className="py-2 px-3">Bounding Box [X, Y, W, H] (%)</th>
                <th className="py-2 px-3 text-right">Pixel Coords (Norm)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {detections.map((det) => {
                const [x, y, w, h] = det.bbox;
                const pxX1 = Math.round(x * 19.2);
                const pxY1 = Math.round(y * 10.8);
                const pxX2 = Math.round((x + w) * 19.2);
                const pxY2 = Math.round((y + h) * 10.8);

                return (
                  <tr key={det.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-2.5 px-3 flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full inline-block"
                        style={{ backgroundColor: det.color || '#38bdf8' }}
                      />
                      <span className="font-bold text-slate-200 capitalize">
                        {det.label}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-slate-900 h-1.5 rounded-full overflow-hidden border border-slate-800">
                          <div
                            className="bg-cyan-400 h-full rounded-full"
                            style={{ width: `${det.confidence * 100}%` }}
                          />
                        </div>
                        <span className="text-cyan-300 font-semibold">
                          {(det.confidence * 100).toFixed(1)}%
                        </span>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-slate-400">
                      [{x.toFixed(1)}%, {y.toFixed(1)}%, {w.toFixed(1)}%, {h.toFixed(1)}%]
                    </td>
                    <td className="py-2.5 px-3 text-right text-slate-400">
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
