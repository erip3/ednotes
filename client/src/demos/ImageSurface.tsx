import React, { useRef, useState } from "react";
import Plot from "react-plotly.js";

/**
 * 
 * @returns JSX.Element
 */
export default function ImageTo3DSurface() {
  const [surfaceData, setSurfaceData] = useState<number[][] | null>(null);
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [selection, setSelection] = useState<{ x: number; y: number } | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /**
   * Handle image upload
   * @param e - The change event from the file input
   * @returns void
   */
  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const image = new window.Image();

    // When image loads, make it grayscale and draw it to the canvas
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
    image.src = URL.createObjectURL(file);
    setSelection(null);
    setSurfaceData(null);
  }

  /**
   * Handle area selection
   * @param x - The x-coordinate of the selection
   * @param y - The y-coordinate of the selection
   * @returns void
   */
  function handleAreaSelect(x: number, y: number) {
    if (!img) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    // Clamp selection to image bounds
    const sx = Math.max(0, Math.min(x, img.width - 15));
    const sy = Math.max(0, Math.min(y, img.height - 15));
    setSelection({ x: sx, y: sy });

    // Get 15x15 pixel area starting at (sx, sy)
    const imgData = ctx.getImageData(sx, sy, 15, 15).data;
    const z: number[][] = [];
    for (let i = 0; i < 15; i++) {
      const row: number[] = [];
      for (let j = 0; j < 15; j++) {
        const idx = (i * 15 + j) * 4;
        // Convert to grayscale: 0.299*R + 0.587*G + 0.114*B
        const gray =
          0.299 * imgData[idx] +
          0.587 * imgData[idx + 1] +
          0.114 * imgData[idx + 2];
        row.push(gray);
      }
      z.push(row);
    }
    setSurfaceData(z);

    // Redraw image and rectangle
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);
    ctx.strokeStyle = "#00f";
    ctx.lineWidth = 2;
    ctx.strokeRect(sx + 0.5, sy + 0.5, 15, 15);
  }

  /**
   * Handle canvas click
   * @param e - The mouse event from clicking the canvas
   * @returns void
   */
  function handleCanvasClick(e: React.MouseEvent<HTMLCanvasElement>) {
    if (!img) return;
    const rect = (e.target as HTMLCanvasElement).getBoundingClientRect();
    const x = Math.floor(e.clientX - rect.left);
    const y = Math.floor(e.clientY - rect.top);
    handleAreaSelect(x, y);
  }

  // Redraw rectangle if selection or image changes
  React.useEffect(() => {
    if (!img || !selection) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);
    ctx.strokeStyle = "#00f";
    ctx.lineWidth = 2;
    ctx.strokeRect(selection.x + 0.5, selection.y + 0.5, 15, 15);
  }, [img, selection]);

  return (
    <div>
      {/* Custom file input button */}
      <button
        type="button"
        className="mb-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        onClick={() => fileInputRef.current?.click()}
      >
        Choose File
      </button>
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleImageUpload}
        className="hidden"
      />

      {/* Canvas for image display and selection */}
      <div>
        <canvas
          ref={canvasRef}
          style={{ border: "1px solid #ccc", margin: "1rem 0", cursor: img ? "crosshair" : "default" }}
          onClick={handleCanvasClick}
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