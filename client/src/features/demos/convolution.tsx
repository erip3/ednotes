import React, { useState, useEffect, useRef } from 'react';

interface ConvolutionDemoProps {
  size?: number;
  kernel?: number[][];
  borderMethod?: 'zero' | 'replicate' | 'reflect' | 'wrap';
  interval?: number; // ms between steps
}

function generateMatrix(size: number): number[][] {
  return Array.from({ length: size }, () =>
    Array.from({ length: size }, () => Math.floor(Math.random() * 10)),
  );
}

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
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          margin: '0.5rem',
        }}
      >
        <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>
          {label}
        </div>
        <table style={{ borderCollapse: 'collapse' }}>
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
                      style={{
                        border: '1px solid #888',
                        width: 32,
                        height: 32,
                        textAlign: 'center',
                        background: isHighlighted ? '#ffeeba' : '#fff',
                        fontWeight: isHighlighted ? 'bold' : 'normal',
                        color: 'black',
                      }}
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
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '2rem',
        }}
      >
        {renderMatrix(input, highlight, 'Input Matrix')}
        {renderMatrix(rotatedKernel, undefined, 'Kernel (rotated 180°)')}
        {renderMatrix(output, undefined, 'Output Matrix')}
      </div>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1rem',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: '1.5rem',
        }}
      >
        <button
          type="button"
          onClick={stepConvolution}
          disabled={step >= size * size || playing}
          style={{
            padding: '0.5rem 1rem',
            fontWeight: 'bold',
            color: 'black',
            borderRadius: '6px',
            border: '1px solid #888',
            background: step >= size * size || playing ? '#eee' : '#fff',
            cursor: step >= size * size || playing ? 'not-allowed' : 'pointer',
          }}
        >
          Step
        </button>
        <button
          type="button"
          onClick={handlePlayPause}
          disabled={step >= size * size}
          style={{
            padding: '0.5rem 1rem',
            fontWeight: 'bold',
            color: 'black',
            borderRadius: '6px',
            border: '1px solid #888',
            background: step >= size * size ? '#eee' : '#fff',
            cursor: step >= size * size ? 'not-allowed' : 'pointer',
          }}
        >
          {playing ? 'Pause' : 'Play'}
        </button>
        <button
          type="button"
          onClick={handleReset}
          style={{
            padding: '0.5rem 1rem',
            fontWeight: 'bold',
            color: 'black',
            borderRadius: '6px',
            border: '1px solid #888',
            background: '#fff',
            cursor: 'pointer',
          }}
        >
          Reset
        </button>
        <span>Step: {step}</span>
        <span>Border: {borderMethod}</span>
      </div>
    </div>
  );
};
