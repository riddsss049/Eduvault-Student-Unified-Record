import React from "react";

export default function DummyBarChart({ data = [12, 25, 18, 30, 22, 28], colors }) {
  const max = Math.max(...data, 1);
  const width = 720;
  const height = 200;
  const padding = 20;
  const barGap = 12;
  const barWidth = (width - padding * 2 - barGap * (data.length - 1)) / data.length;
  const defaultColors = [
    "url(#g0)",
    "url(#g1)",
    "url(#g2)",
    "url(#g3)",
    "url(#g4)",
    "url(#g5)",
  ];

  const fills = colors && colors.length >= data.length ? colors : defaultColors;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} width="100%" height="200" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Bar chart">
      <defs>
        <linearGradient id="g0" x1="0" x2="1">
          <stop offset="0%" stopColor="#60a5fa" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
        <linearGradient id="g1" x1="0" x2="1">
          <stop offset="0%" stopColor="#34d399" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
        <linearGradient id="g2" x1="0" x2="1">
          <stop offset="0%" stopColor="#fca5a5" />
          <stop offset="100%" stopColor="#fb7185" />
        </linearGradient>
        <linearGradient id="g3" x1="0" x2="1">
          <stop offset="0%" stopColor="#fde68a" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
        <linearGradient id="g4" x1="0" x2="1">
          <stop offset="0%" stopColor="#ddd6fe" />
          <stop offset="100%" stopColor="#a78bfa" />
        </linearGradient>
        <linearGradient id="g5" x1="0" x2="1">
          <stop offset="0%" stopColor="#c7f9cc" />
          <stop offset="100%" stopColor="#34d399" />
        </linearGradient>
      </defs>

      {/* background grid lines */}
      {[0, 0.25, 0.5, 0.75, 1].map((t, i) => (
        <line
          key={i}
          x1={padding}
          x2={width - padding}
          y1={padding + (height - padding * 2) * (1 - t)}
          y2={padding + (height - padding * 2) * (1 - t)}
          stroke="#eef2f7"
          strokeWidth="1"
        />
      ))}

      {/* bars */}
      {data.map((d, i) => {
        const h = ((d / max) * (height - padding * 2)) | 0;
        const x = padding + i * (barWidth + barGap);
        const y = height - padding - h;
        return (
          <g key={i}>
            <rect
              x={x}
              y={y}
              width={barWidth}
              height={h}
              rx="8"
              fill={fills[i % fills.length]}
              style={{ transition: "all .3s ease" }}
            />
            <text
              x={x + barWidth / 2}
              y={y - 8}
              fontSize="11"
              fill="#475569"
              textAnchor="middle"
            >
              {d}
            </text>
          </g>
        );
      })}

      {/* labels (months sample) */}
      {["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map((lbl, i) => {
        const x = padding + i * (barWidth + barGap) + barWidth / 2;
        return (
          <text key={i} x={x} y={height - 6} fontSize="11" fill="#94a3b8" textAnchor="middle">
            {lbl}
          </text>
        );
      })}
    </svg>
  );
}