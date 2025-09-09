import React, { useRef, useState } from "react";
import Plot from "react-plotly.js";

/**
 * Image to 3D Surface component allows users to upload an image,
 * select a pixel area, and visualize it as a 3D surface plot.
 * @returns JSX.Element
 */
export default function ImageTo3DSurface({ imageSrc }: { imageSrc?: string }) {
  const [surfaceData, setSurfaceData] = useState<number[][] | null>(null); // 2D array for surface plot
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [selection, setSelection] = useState<{
    x: number;
    y: number;
    width?: number;
    height?: number;
  } | null>(null);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(
    null
  );
  const [dragEnd, setDragEnd] = useState<{ x: number; y: number } | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  function handleCanvasMouseDown(e: React.MouseEvent<HTMLCanvasElement>) {
    if (!img) return;
    const rect = (e.target as HTMLCanvasElement).getBoundingClientRect();
    const x = Math.floor(e.clientX - rect.left);
    const y = Math.floor(e.clientY - rect.top);
    setDragStart({ x, y });
    setDragEnd({ x, y });
  }

  function handleCanvasMouseMove(e: React.MouseEvent<HTMLCanvasElement>) {
    if (!img || !dragStart) return;
    const rect = (e.target as HTMLCanvasElement).getBoundingClientRect();
    const x = Math.floor(e.clientX - rect.left);
    const y = Math.floor(e.clientY - rect.top);
    setDragEnd({ x, y });
  }

  function handleCanvasMouseUp() {
    if (!img || !dragStart || !dragEnd) return;
    // Calculate selection rectangle
    const sx = Math.max(0, Math.min(dragStart.x, dragEnd.x));
    const sy = Math.max(0, Math.min(dragStart.y, dragEnd.y));
    const ex = Math.min(img.width, Math.max(dragStart.x, dragEnd.x));
    const ey = Math.min(img.height, Math.max(dragStart.y, dragEnd.y));
    const width = ex - sx;
    const height = ey - sy;
    setSelection({ x: sx, y: sy, width, height });
    setDragStart(null);
    setDragEnd(null);

    // Extract area and set surfaceData
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const imgData = ctx.getImageData(sx, sy, width, height).data;
    const z: number[][] = [];
    for (let i = 0; i < height; i++) {
      const row: number[] = [];
      for (let j = 0; j < width; j++) {
        const idx = (i * width + j) * 4;
        const gray =
          0.299 * imgData[idx] +
          0.587 * imgData[idx + 1] +
          0.114 * imgData[idx + 2];
        row.push(gray);
      }
      z.push(row);
    }
    setSurfaceData(z);
  }

  // Redraw rectangle if selection or image changes
  React.useEffect(() => {
    if (!img) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    // Always clear and redraw the image
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);

    // Draw selection rectangle while dragging
    if (dragStart && dragEnd) {
      const sx = dragStart.x;
      const sy = dragStart.y;
      const ex = dragEnd.x;
      const ey = dragEnd.y;
      ctx.save();
      ctx.strokeStyle = "#0074D9";
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 4]);
      ctx.strokeRect(
        Math.min(sx, ex) + 0.5,
        Math.min(sy, ey) + 0.5,
        Math.abs(ex - sx),
        Math.abs(ey - sy)
      );
      ctx.restore();
    }

    // Optionally, draw the final selection rectangle after selection
    if (
      selection &&
      selection.width &&
      selection.height &&
      !dragStart &&
      !dragEnd
    ) {
      ctx.save();
      ctx.strokeStyle = "#0074D9";
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 4]);
      ctx.strokeRect(
        selection.x + 0.5,
        selection.y + 0.5,
        selection.width,
        selection.height
      );
      ctx.restore();
    }
  }, [img, dragStart, dragEnd, selection]);

  // Load image from imageSrc prop or file input
  React.useEffect(() => {
    if (imageSrc) {
      const image = new window.Image();
      image.onload = () => {
        setImg(image);
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        canvas.width = image.width;
        canvas.height = image.height;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(image, 0, 0);
      };
      image.src = imageSrc;
    }
  }, [imageSrc]);

  return (
    <div>
      {/* Canvas for image display and selection */}
      <div>
        <canvas
          ref={canvasRef}
          style={{
            border: "1px solid #ccc",
            margin: "1rem 0",
            cursor: img ? "crosshair" : "default",
          }}
          onMouseDown={handleCanvasMouseDown}
          onMouseMove={handleCanvasMouseMove}
          onMouseUp={handleCanvasMouseUp}
        />
      </div>

      {/* 3D Surface Plot */}
      {surfaceData && (
        <Plot
          data={[{ z: surfaceData, type: "surface" }]}
          layout={{ width: 500, height: 400, title: { text: "3D Surface" } }}
        />
      )}
      <p className="mt-2 text-sm text-gray-500">
        {img
          ? "Click on the image to select the top-left corner of a 15x15 area. The selected area will be outlined in blue."
          : "Upload an image to begin."}
      </p>
    </div>
  );
}
