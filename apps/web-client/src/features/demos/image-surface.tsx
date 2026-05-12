/**
 * @module features/demos/image-surface
 * @description Interactive demo that allows users to select a square region from a grayscale
 * image and visualize it as a 3D surface plot using Plotly.
 *
 * Features:
 * - **Canvas-based selection**: Click and drag to select a square area
 * - **Responsive sizing**: Canvas scales to container width with proper coordinate mapping
 * - **Performance optimized**: Downsamples large selections to maintain smooth rendering
 * - **Grayscale visualization**: Intensity mapped to height (0-255 → z-axis)
 * - **Bird's-eye camera**: Default view looks down from above, matching image orientation
 *
 * @example
 * // With custom image
 * <ImageTo3DSurface imageSrc="/path/to/image.jpg" />
 *
 * @example
 * // With fallback from assets
 * <ImageTo3DSurface />
 */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import Plot from 'react-plotly.js';

/**
 * Renders an interactive image-to-3D-surface demo.
 *
 * Implementation details:
 * - Scales pointer coordinates to match canvas dimensions
 * - Constrains selection to a perfect square during drag
 * - Extracts pixel data after clearing selection rectangle to avoid artifacts
 * - Downsamples selections >50k pixels for performance
 * - Reverses row order so image top appears at plot top
 *
 * @component
 * @param {ImageTo3DSurfaceProps} props - Component props
 * @param {string} [props.imageSrc] - Image URL to visualize
 * @returns {JSX.Element} Canvas for selection and Plotly 3D surface plot
 *
 * @remarks
 * - Selection is always square (uses smaller of width/height during drag)
 * - Canvas uses ResizeObserver for responsive behavior
 * - Grayscale filter applied via CSS for visual consistency
 * - Plotly camera positioned at (0,0,1.8) for overhead view
 *
 * @example
 * <ImageTo3DSurface imageSrc="https://example.com/image.jpg" />
 */
export const ImageTo3DSurface = ({ imageSrc }: { imageSrc?: string }) => {
  const [surfaceData, setSurfaceData] = useState<number[][] | null>(null); // 2D array for surface plot
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [selection, setSelection] = useState<{
    x: number;
    y: number;
    width?: number;
    height?: number;
  } | null>(null);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(
    null,
  );
  const [dragEnd, setDragEnd] = useState<{ x: number; y: number } | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [, setScale] = useState(1);

  // Sample image fallback from client assets
  const imageModules = import.meta.glob('@/assets/images/*', {
    eager: true,
    query: '?url',
    import: 'default',
  });
  // Safe inline SVG gradient (same-origin via data URL) to avoid CORS taint
  const gradientSvg =
    '<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400">\
    <defs><linearGradient id="g" x1="0" x2="1" y1="0" y2="1">\
    <stop offset="0%" stop-color="black"/><stop offset="100%" stop-color="white"/>\
    </linearGradient></defs><rect width="100%" height="100%" fill="url(#g)"/></svg>';
  const fallbackImage =
    (Object.values(imageModules)[0] as string) ??
    `data:image/svg+xml;charset=utf-8,${encodeURIComponent(gradientSvg)}`;

  const handleCanvasPointerDown = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (!img) return;
      const canvas = e.target as HTMLCanvasElement;
      const rect = canvas.getBoundingClientRect();
      // Scale coordinates from displayed size to canvas intrinsic size
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const x = Math.floor((e.clientX - rect.left) * scaleX);
      const y = Math.floor((e.clientY - rect.top) * scaleY);
      setDragStart({ x, y });
      setDragEnd({ x, y });
      // Prevent default touch behavior and capture pointer
      e.preventDefault();
      canvas.setPointerCapture(e.pointerId);
    },
    [img],
  );

  const handleCanvasPointerMove = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (!img || !dragStart) return;
      const canvas = e.target as HTMLCanvasElement;
      const rect = canvas.getBoundingClientRect();
      // Scale coordinates from displayed size to canvas intrinsic size
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const x = Math.floor((e.clientX - rect.left) * scaleX);
      const y = Math.floor((e.clientY - rect.top) * scaleY);

      // Constrain to square by using the smaller dimension
      const dx = x - dragStart.x;
      const dy = y - dragStart.y;
      const size = Math.min(Math.abs(dx), Math.abs(dy));
      const constrainedX = dragStart.x + (dx >= 0 ? size : -size);
      const constrainedY = dragStart.y + (dy >= 0 ? size : -size);

      setDragEnd({ x: constrainedX, y: constrainedY });
      // Prevent default touch behavior
      e.preventDefault();
    },
    [img, dragStart],
  );

  const handleCanvasPointerUp = useCallback(() => {
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
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas and redraw image to get clean pixels without selection rectangle
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    let imgData: Uint8ClampedArray;
    try {
      imgData = ctx.getImageData(sx, sy, width, height).data;
    } catch (e) {
      console.error(
        'Failed to read pixels from canvas. Possibly CORS-tainted image.',
        e,
      );
      // Show a graceful message and abort surface generation
      setSurfaceData(null);
      return;
    }

    // Downsample large selections to keep plot performant
    const MAX_POINTS = 50000; // cap grid cells
    const total = width * height;
    const step =
      total > MAX_POINTS ? Math.ceil(Math.sqrt(total / MAX_POINTS)) : 1;

    const z: number[][] = [];
    for (let i = 0; i < height; i += step) {
      const row: number[] = [];
      for (let j = 0; j < width; j += step) {
        const idx = (i * width + j) * 4;
        const gray =
          0.299 * imgData[idx] +
          0.587 * imgData[idx + 1] +
          0.114 * imgData[idx + 2];
        row.push(gray);
      }
      z.push(row);
    }
    // Reverse rows so top of image appears at top of plot
    setSurfaceData(z.reverse());
  }, [img, dragStart, dragEnd]);

  // Redraw rectangle if selection or image changes
  useEffect(() => {
    if (!img) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    // Always clear and redraw the image
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    // Draw selection rectangle while dragging
    if (dragStart && dragEnd) {
      const sx = dragStart.x;
      const sy = dragStart.y;
      const ex = dragEnd.x;
      const ey = dragEnd.y;
      ctx.save();
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 4]);
      ctx.strokeRect(
        Math.min(sx, ex) + 0.5,
        Math.min(sy, ey) + 0.5,
        Math.abs(ex - sx),
        Math.abs(ey - sy),
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
      ctx.lineWidth = 1;
      ctx.setLineDash([6, 4]);
      ctx.strokeRect(
        selection.x,
        selection.y,
        selection.width,
        selection.height,
      );
      ctx.restore();
    }
  }, [img, dragStart, dragEnd, selection]);

  // Load image from imageSrc prop or file input
  useEffect(() => {
    const src = imageSrc || fallbackImage;
    if (!src) return;
    const image = new window.Image();
    // Allow reading pixels when source allows CORS; harmless for data URLs/same-origin
    image.crossOrigin = 'anonymous';
    image.onload = () => {
      setImg(image);
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;
      const availableWidth = Math.min(container.clientWidth, image.width);
      const s = availableWidth / image.width;
      setScale(s);
      canvas.width = Math.floor(image.width * s);
      canvas.height = Math.floor(image.height * s);
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    };
    image.src = src;
    return () => {
      image.onload = null;
    };
  }, [imageSrc]);

  // Redraw on container resize
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !img) return;
    const ro = new ResizeObserver(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const availableWidth = Math.min(container.clientWidth, img.width);
      const s = availableWidth / img.width;
      setScale(s);
      canvas.width = Math.floor(img.width * s);
      canvas.height = Math.floor(img.height * s);
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    });
    ro.observe(container);
    return () => ro.disconnect();
  }, [img]);

  return (
    <div className="flex flex-col items-center">
      {/* Canvas for image display and selection */}
      <div ref={containerRef} className="w-full max-w-[600px]">
        <canvas
          ref={canvasRef}
          style={{
            border: '1px solid #ccc',
            margin: '1rem 0',
            cursor: img ? 'crosshair' : 'default',
            filter: 'grayscale(1)',
            width: '100%',
            height: 'auto',
            touchAction: 'none',
          }}
          onPointerDown={handleCanvasPointerDown}
          onPointerMove={handleCanvasPointerMove}
          onPointerUp={handleCanvasPointerUp}
        />
      </div>

      {/* 3D Surface Plot */}
      {surfaceData && (
        <div className="w-full max-w-[600px]">
          <Plot
            data={[
              {
                z: surfaceData,
                type: 'surface',
                colorscale: [
                  [0, 'rgb(0,0,0)'],
                  [0.5, 'rgb(128,128,128)'],
                  [1, 'rgb(255,255,255)'],
                ],
              },
            ]}
            layout={{
              autosize: true,
              title: { text: '3D Surface' },
              margin: { l: 0, r: 0, t: 32, b: 0 },
              scene: {
                xaxis: { visible: false },
                yaxis: { visible: false },
                camera: {
                  eye: { x: 0, y: 0, z: 1.8 },
                  center: { x: 0, y: 0, z: -0.2 },
                  up: { x: 0, y: 1, z: 0 },
                },
              },
            }}
            config={{ responsive: true }}
            useResizeHandler={true}
            style={{ width: '100%', height: '400px' }}
          />
        </div>
      )}
      <p className="mt-2 text-sm text-gray-500">
        {img
          ? 'Click and drag to select an area of the image. The selected area will be visualized as a 3D surface plot.'
          : 'Loading image...'}
      </p>
    </div>
  );
};
