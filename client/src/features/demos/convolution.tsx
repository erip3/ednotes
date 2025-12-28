/**
 * @module features/demos/convolution
 * @description Step-by-step visualization of 2D discrete convolution operation.
 * Demonstrates how a kernel is applied to an input matrix to produce an output matrix,
 * with support for various border handling methods.
 *
 * Features:
 * - **Step-by-step execution**: Manual stepping or auto-play through convolution
 * - **Visual highlighting**: Shows current kernel position on input matrix
 * - **Border methods**: Zero-padding, replicate, reflect, wrap
 * - **Kernel rotation**: Automatically rotates kernel 180° for convolution
 *
 * Border handling methods:
 * - `zero`: Pads with zeros outside boundaries
 * - `replicate`: Repeats edge pixels
 * - `reflect`: Mirrors pixels at boundaries
 * - `wrap`: Wraps around to opposite edge
 *
 * @example
 * // With custom kernel
 * <ConvolutionDemo
 *   size={5}
 *   kernel={[[1, 0, -1], [1, 0, -1], [1, 0, -1]]}
 *   borderMethod="zero"
 *   interval={300}
 * />
 */
import React, { useState, useEffect, useRef } from 'react';

import { Button } from '@/components/ui/button';

/**
 * Props for ConvolutionDemo component.
 * @interface ConvolutionDemoProps
 * @property {number} [size=5] - Size of the input/output matrices (n×n)
 * @property {number[][]} [kernel] - Convolution kernel (default: sharpening kernel)
 * @property {'zero' | 'replicate' | 'reflect' | 'wrap'} [borderMethod='zero'] - Border handling method
 * @property {number} [interval=500] - Milliseconds between auto-play steps
 */
interface ConvolutionDemoProps {
  size?: number;
  kernel?: number[][];
  borderMethod?: 'zero' | 'replicate' | 'reflect' | 'wrap';
  interval?: number; // ms between steps
}

/**
 * Rotates a 2D kernel matrix 180 degrees.
 *
 * This transformation converts a correlation kernel into a convolution kernel
 * by reversing both rows and columns. Required for proper convolution operation.
 *
 * @param {number[][]} kernel - Input kernel matrix
 * @returns {number[][]} Kernel rotated 180 degrees
 *
 * @example
 * rotateKernel([[1, 2], [3, 4]]) // Returns [[4, 3], [2, 1]]
 */
function rotateKernel(kernel: number[][]): number[][] {
  return kernel
    .map((row) => [...row])
    .reverse()
    .map((row) => row.reverse());
}

const defaultMatrix = [
  [1, 2, 3, 4, 5],
  [1, 2, 3, 4, 5],
  [1, 2, 3, 4, 5],
  [1, 2, 3, 4, 5],
  [1, 2, 3, 4, 5],
];

/**
 * Interactive 2D convolution demo with step-by-step visualization.
 *
 * Displays three matrices side-by-side:
 * 1. **Input Matrix**: Highlights current kernel window position
 * 2. **Kernel**: Shows the 180° rotated convolution kernel
 * 3. **Output Matrix**: Fills progressively as convolution proceeds
 *
 * Controls allow stepping through the operation manually, auto-playing,
 * or resetting. The current step and border method are displayed below.
 *
 * @component
 * @param {ConvolutionDemoProps} props - Component props
 * @param {number} [props.size=5] - Matrix dimensions (n×n)
 * @param {number[][]} [props.kernel] - Convolution kernel (default: sharpening)
 * @param {'zero' | 'replicate' | 'reflect' | 'wrap'} [props.borderMethod='zero'] - Border handling
 * @param {number} [props.interval=500] - Auto-play step interval in ms
 * @returns {JSX.Element} Convolution visualization with controls
 *
 * @remarks
 * - Kernel is automatically rotated 180° for proper convolution
 * - Highlighted cells show the current convolution window
 * - Step counter shows progress through n² total steps
 * - Border method determines how out-of-bounds pixels are handled
 *
 * @example
 * // Edge detection kernel
 * <ConvolutionDemo
 *   kernel={[[-1, -1, -1], [-1, 8, -1], [-1, -1, -1]]}
 *   borderMethod="replicate"
 * />
 */
export const ConvolutionDemo: React.FC<ConvolutionDemoProps> = ({
  size = 5,
  kernel = [
    [0, -1, 0],
    [-1, 5, -1],
    [0, -1, 0],
  ],
  borderMethod = 'zero',
  interval = 500,
}) => {
  const [input] = useState<number[][]>(defaultMatrix);
  const [output, setOutput] = useState<number[][]>(
    Array.from({ length: size }, () => Array(size).fill(0)),
  );
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const rotatedKernel = rotateKernel(kernel);

  function getPixel(
    data: number[][],
    x: number,
    y: number,
    size: number,
    borderMethod: string,
  ): number {
    if (x >= 0 && x < size && y >= 0 && y < size) return data[y][x];
    if (borderMethod === 'zero') return 0;
    if (borderMethod === 'replicate') {
      return data[Math.max(0, Math.min(size - 1, y))][
        Math.max(0, Math.min(size - 1, x))
      ];
    }
    if (borderMethod === 'reflect') {
      const rx = x < 0 ? -x : x >= size ? 2 * size - x - 2 : x;
      const ry = y < 0 ? -y : y >= size ? 2 * size - y - 2 : y;
      return data[Math.max(0, Math.min(size - 1, ry))][
        Math.max(0, Math.min(size - 1, rx))
      ];
    }
    if (borderMethod === 'wrap') {
      // Wrap around using modulo
      const rx = ((x % size) + size) % size;
      const ry = ((y % size) + size) % size;
      return data[ry][rx];
    }
    return 0;
  }

  function stepConvolution() {
    const kh = rotatedKernel.length,
      kw = rotatedKernel[0].length;
    const kCenterY = Math.floor(kh / 2),
      kCenterX = Math.floor(kw / 2);
    let y = Math.floor(step / size),
      x = step % size;
    if (y < size) {
      let sum = 0;
      for (let ky = 0; ky < kh; ky++) {
        for (let kx = 0; kx < kw; kx++) {
          const px = x + kx - kCenterX;
          const py = y + ky - kCenterY;
          sum +=
            rotatedKernel[ky][kx] * getPixel(input, px, py, size, borderMethod);
        }
      }
      const newOutput = output.map((row) => [...row]);
      newOutput[y][x] = Math.round(sum * 100) / 100;
      setOutput(newOutput);
      setStep(step + 1);
    }
  }

  useEffect(() => {
    if (playing && step < size * size) {
      timerRef.current = setTimeout(() => {
        stepConvolution();
      }, interval);
    } else if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [playing, step]);

  function renderMatrix(
    matrix: number[][],
    highlight?: [number, number][],
    label?: string,
  ) {
    return (
      <div className="m-2 flex flex-col items-center">
        <div className="mb-1 font-bold">{label}</div>
        <table className="border-collapse">
          <tbody>
            {matrix.map((row, y) => (
              <tr key={y}>
                {row.map((val, x) => {
                  const isHighlighted = highlight?.some(
                    ([hy, hx]) => hy === y && hx === x,
                  );
                  return (
                    <td
                      key={x}
                      className={`
                        h-8 w-8 border border-border text-center
                        ${isHighlighted ? 'bg-accent-background font-bold' : 'bg-primary-background'}
                        text-card-foreground
                      `}
                    >
                      {val}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  // Highlight kernel window
  const kh = rotatedKernel.length,
    kw = rotatedKernel[0].length;
  const kCenterY = Math.floor(kh / 2),
    kCenterX = Math.floor(kw / 2);
  let y = Math.floor(step / size),
    x = step % size;
  let highlight: [number, number][] = [];
  if (y < size) {
    for (let ky = 0; ky < kh; ky++) {
      for (let kx = 0; kx < kw; kx++) {
        const px = x + kx - kCenterX;
        const py = y + ky - kCenterY;
        if (px >= 0 && px < size && py >= 0 && py < size) {
          highlight.push([py, px]);
        }
      }
    }
  }

  function handlePlayPause() {
    if (playing) {
      setPlaying(false);
    } else if (step < size * size) {
      setPlaying(true);
    }
  }

  function handleReset() {
    setOutput(Array.from({ length: size }, () => Array(size).fill(0)));
    setStep(0);
    setPlaying(false);
  }

  return (
    <div>
      <div className="flex flex-wrap justify-center gap-8">
        {renderMatrix(input, highlight, 'Input Matrix')}
        {renderMatrix(rotatedKernel, undefined, 'Kernel (rotated 180°)')}
        {renderMatrix(output, undefined, 'Output Matrix')}
      </div>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
        <Button
          onClick={stepConvolution}
          disabled={step >= size * size || playing}
          variant="outline"
        >
          Step
        </Button>
        <Button
          onClick={handlePlayPause}
          disabled={step >= size * size}
          variant="outline"
        >
          {playing ? 'Pause' : 'Play'}
        </Button>
        <Button onClick={handleReset} variant="outline">
          Reset
        </Button>
        <span className="text-sm">Step: {step}</span>
        <span className="text-sm">Border: {borderMethod}</span>
      </div>
    </div>
  );
};
