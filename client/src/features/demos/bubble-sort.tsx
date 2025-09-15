import { useState, useRef, useEffect } from 'react';

function getRandomArray(size = 10) {
  // Give each bar a unique id for stable keys
  return Array.from({ length: size }, (_, i) => ({
    id: i + '-' + Math.random().toString(36).slice(2, 8),
    value: Math.floor(Math.random() * 100),
  }));
}

export const BubbleSortDemo = () => {
  const [array, setArray] = useState(getRandomArray());
  const [i, setI] = useState(0);
  const [j, setJ] = useState(0);
  const [isSorted, setIsSorted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(100);
  const intervalRef = useRef<number | null>(null);

  // Store the original order for animation
  const originalOrder = useRef(array.map((bar) => bar.id));

  // Step through the algorithm
  function step() {
    if (isSorted) return;
    const arr = [...array];
    if (arr[j].value > arr[j + 1].value) {
      [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
    }
    if (j + 1 < arr.length - i - 1) {
      setJ(j + 1);
    } else if (i + 1 < arr.length) {
      setI(i + 1);
      setJ(0);
    } else {
      setIsSorted(true);
      setIsPlaying(false);
    }
    setArray(arr);
  }

  function reset() {
    const newArr = getRandomArray();
    setArray(newArr);
    originalOrder.current = newArr.map((bar) => bar.id);
    setI(0);
    setJ(0);
    setIsSorted(false);
    setIsPlaying(false);
  }

  // Play/Pause logic
  useEffect(() => {
    if (isPlaying && !isSorted) {
      intervalRef.current = window.setInterval(() => {
        step();
      }, speed);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, isSorted, i, j, array, speed]);

  // Calculate positions for animation
  const barWidth = 32;
  const barGap = 8;
  const totalWidth = array.length * barWidth + (array.length - 1) * barGap;

  // For each bar in original order, find its current index in the array
  const bars = originalOrder.current.map((id) => {
    const currIdx = array.findIndex((bar) => bar.id === id);
    const bar = array[currIdx];
    return {
      ...bar,
      currIdx,
    };
  });

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        className="relative h-40"
        style={{
          width: totalWidth,
        }}
      >
        {bars.map((bar) => {
          const x = bar.currIdx * (barWidth + barGap);
          return (
            <div
              key={bar.id}
              className={`
                absolute
                flex w-8
                items-end
                justify-center rounded text-lg font-bold
                text-white transition-transform duration-300
                ${
                  bar.currIdx === j || bar.currIdx === j + 1
                    ? 'bg-yellow-400 text-black'
                    : 'bg-blue-400'
                }
                ${isSorted ? 'bg-green-400' : ''}
              `}
              style={{
                height: `${bar.value + 20}px`,
                transform: `translateX(${x}px)`,
                zIndex: bar.currIdx === j || bar.currIdx === j + 1 ? 2 : 1,
                left: 0,
                bottom: 0,
              }}
            >
              {bar.value}
            </div>
          );
        })}
      </div>
      <div className="flex gap-2">
        <button
          className="rounded bg-blue-600 px-4 py-2 text-white"
          onClick={step}
          disabled={isSorted || isPlaying}
        >
          Step
        </button>
        <button
          className={`rounded px-4 py-2 ${
            isPlaying ? 'bg-yellow-600' : 'bg-green-600'
          } text-white`}
          onClick={() => setIsPlaying((p) => !p)}
          disabled={isSorted}
        >
          {isPlaying ? 'Pause' : 'Play'}
        </button>
        <button
          className="rounded bg-gray-600 px-4 py-2 text-white"
          onClick={reset}
        >
          Reset
        </button>
        <label className="ml-2 flex items-center gap-1 text-sm">
          Speed:
          <input
            type="range"
            min={100}
            max={1200}
            step={50}
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="ml-2"
          />
          <span className="inline-block w-10">{speed}ms</span>
        </label>
      </div>
    </div>
  );
};
