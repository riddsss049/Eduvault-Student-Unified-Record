import React from "react";

function polarToCartesian(cx, cy, r, angleDeg) {
  const angleRad = ((angleDeg - 90) * Math.PI) / 180.0;
  return { x: cx + r * Math.cos(angleRad), y: cy + r * Math.sin(angleRad) };
}

function arcPath(cx, cy, r, startAngle, endAngle) {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const large = endAngle - startAngle <= 180 ? "0" : "1";
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${large} 0 ${end.x} ${end.y}`;
}

export default function DummyDonut({ data = [60, 25, 15], colors = ["#0ea5b7", "#6366f1", "#f59e0b"], labels }) {
  const size = 220;
  const cx = size / 2;
  const cy = size / 2;
  const r = 70;
  const total = data.reduce((s, v) => s + v, 0) || 1;
  let angle = 0;

  return (
    <div style={{ position: "relative", width: "100%", maxWidth: size }}>
      <svg viewBox={`0 0 ${size} ${size}`} width="100%" height={size} role="img" aria-label="Donut chart">
        <g transform={`translate(0,0)`}>
          {data.map((val, i) => {
            const start = angle;
            const sweep = (val / total) * 360;
            const end = start + sweep;
            const path = arcPath(cx, cy, r, start, end);
            angle = end;
            return (
              <g key={i}>
                <path
                  d={path}
                  stroke={colors[i % colors.length]}
                  strokeWidth={24}
                  fill="none"
                  strokeLinecap="round"
                />
              </g>
            );
          })}

          {/* center label */}
          <text
            x={cx}
            y={cy}
            textAnchor="middle"
            fontSize="20"
            fill="#0f172a"
            fontWeight="700"
            dy="7"
          >
            {Math.round((data[0] / total) * 100)}%
          </text>
        </g>
      </svg>

      {/* legend placed top-right outside the donut */}
      <div
        style={{
          position: "absolute",
          top: 8,
          right: 8,
          background: "rgba(255,255,255,0.98)",
          padding: "8px 10px",
          borderRadius: 8,
          boxShadow: "0 8px 20px rgba(2,6,23,0.06)",
          display: "flex",
          flexDirection: "column",
          gap: 8,
          minWidth: 84,
        }}
      >
        {(data || []).map((v, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span
              style={{
                width: 12,
                height: 12,
                borderRadius: 3,
                background: colors[i % colors.length],
                display: "inline-block",
                flex: "0 0 12px",
              }}
            />
            <span style={{ fontSize: 12, color: "#475569", lineHeight: 1 }}>{labels?.[i] ?? `${v}%`}</span>
          </div>
        ))}
      </div>
    </div>
  );
}