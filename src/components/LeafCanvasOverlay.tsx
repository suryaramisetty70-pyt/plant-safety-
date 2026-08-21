import React, { useEffect, useRef } from "react";
import type { Lesion } from "@/types/diagnosis";

interface LeafCanvasOverlayProps {
  lesions: Lesion[];
  isScanning: boolean;
}

export const LeafCanvasOverlay: React.FC<LeafCanvasOverlayProps> = ({
  lesions,
  isScanning
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Resize canvas to parent
    canvas.width = canvas.parentElement?.clientWidth || 320;
    canvas.height = canvas.parentElement?.clientHeight || 280;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (isScanning || lesions.length === 0) return;

    // Draw lesion bounding boxes & radial heatmaps
    lesions.forEach((lesion) => {
      const box = lesion.boundingBox;
      const x = (box.x / 100) * canvas.width;
      const y = (box.y / 100) * canvas.height;
      const w = (box.width / 100) * canvas.width;
      const h = (box.height / 100) * canvas.height;

      // Dashed Bounding Box
      ctx.strokeStyle = lesion.color || "#e74c3c";
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);
      ctx.strokeRect(x, y, w, h);
      ctx.setLineDash([]);

      // Radial Heatmap glow inside box
      const cx = x + w / 2;
      const cy = y + h / 2;
      const r = Math.max(w, h) / 2;

      const grad = ctx.createRadialGradient(cx, cy, 2, cx, cy, r);
      grad.addColorStop(0, "rgba(231, 76, 60, 0.65)");
      grad.addColorStop(1, "rgba(230, 126, 34, 0.1)");

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();

      // Label tag
      ctx.fillStyle = "rgba(10, 15, 13, 0.85)";
      ctx.fillRect(x, Math.max(0, y - 18), 100, 16);
      ctx.fillStyle = "#ffffff";
      ctx.font = "10px sans-serif";
      ctx.fillText(`${lesion.label} (${Math.round(lesion.confidence * 100)}%)`, x + 4, Math.max(12, y - 6));
    });
  }, [lesions, isScanning]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full pointer-events-none z-10"
    />
  );
};
