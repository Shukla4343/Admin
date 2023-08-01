import { useState, useEffect, useRef, useContext } from "react";

function ProgressCircle({ progress, status, color }) {
  const [offset, setOffset] = useState("0");
  const circleRef = useRef(null);
  const radius = 32;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    const progressOffset = ((100 - progress) / 100) * circumference;
    setOffset(progressOffset);
    circleRef.current.style = `transition: stroke-dashoffset 850ms ease-in-out; stroke-dashoffset: ${progressOffset};`;
  }, [setOffset, progress, circumference]);

  return (
    <div
      className={`relative w-48 h-48 border hover:shadow-lg hover:border-gray-300`}
    >
      <svg
        className="absolute top-0 left-0 transform -rotate-90 p-2"
        viewBox="0 0 90 90"
        width="100%"
        height="100%"
      >
        <circle
          className="stroke-current text-gray-300"
          cx="45"
          cy="45"
          r={radius}
          strokeWidth="10"
          fill="none"
        />
        <circle
          ref={circleRef}
          className={`stroke-current ${color}`}
          cx="45"
          cy="45"
          r={radius}
          strokeWidth="10"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div
        className={`static left-10 h-full flex flex-col items-center justify-center ${color} font-bold`}
      >
        <div className={`text-l ${color}`}>{progress}%</div>
        <div className={`text-m font-bold ${color}`}>{status}</div>
      </div>
    </div>
  );
}

export default ProgressCircle;
