interface DataPoint {
  label: string;
  value: number;
}

interface LineChartProps {
  data: DataPoint[];
  color: string;
  height?: number;
  yLabel?: string;
  unit?: string;
}

export function LineChart({ data, color, height = 180, yLabel, unit = '' }: LineChartProps) {
  const width = 100;
  const padding = { top: 20, right: 10, bottom: 30, left: 35 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  const maxVal = Math.max(...data.map((d) => d.value)) * 1.15;
  const minVal = 0;
  const range = maxVal - minVal || 1;

  const points = data.map((d, i) => {
    const x = padding.left + (i / (data.length - 1)) * chartW;
    const y = padding.top + chartH - ((d.value - minVal) / range) * chartH;
    return { x, y, ...d };
  });

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${padding.top + chartH} L ${points[0].x} ${padding.top + chartH} Z`;

  const yTicks = 4;
  const tickValues = Array.from({ length: yTicks + 1 }, (_, i) => Math.round((maxVal / yTicks) * i));

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full" style={{ height: `${height}px` }} preserveAspectRatio="none">
      <defs>
        <linearGradient id={`grad-${color.replace(/[^a-z0-9]/g, '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>

      {tickValues.map((tv, i) => {
        const y = padding.top + chartH - ((tv - minVal) / range) * chartH;
        return (
          <g key={i}>
            <line x1={padding.left} y1={y} x2={width - padding.right} y2={y} stroke="#243b53" strokeWidth="0.2" strokeDasharray="1" />
            <text x={padding.left - 3} y={y + 1.5} fill="#627d98" fontSize="3" textAnchor="end" fontFamily="monospace">
              {tv}
            </text>
          </g>
        );
      })}

      <path d={areaPath} fill={`url(#grad-${color.replace(/[^a-z0-9]/g, '')})`} />
      <path d={linePath} fill="none" stroke={color} strokeWidth="0.6" strokeLinejoin="round" strokeLinecap="round" />

      {points.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="1.2" fill={color} stroke="#0a1929" strokeWidth="0.4" />
          <text x={p.x} y={p.y - 2.5} fill={color} fontSize="2.8" textAnchor="middle" fontFamily="monospace" fontWeight="600">
            {p.value}{unit}
          </text>
          <text x={p.x} y={height - 4} fill="#627d98" fontSize="2.8" textAnchor="middle">
            {p.label}
          </text>
        </g>
      ))}

      {yLabel && (
        <text x={6} y={height / 2} fill="#627d98" fontSize="3" textAnchor="middle" transform={`rotate(-90 6 ${height / 2})`}>
          {yLabel}
        </text>
      )}
    </svg>
  );
}

interface BarChartProps {
  data: DataPoint[];
  color: string;
  height?: number;
  unit?: string;
  highlightThreshold?: number;
  highlightColor?: string;
}

export function BarChart({ data, color, height = 180, unit = '', highlightThreshold, highlightColor }: BarChartProps) {
  const width = 100;
  const padding = { top: 20, right: 10, bottom: 30, left: 35 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;
  const maxVal = Math.max(...data.map((d) => d.value)) * 1.2;
  const barWidth = chartW / data.length;
  const barGap = barWidth * 0.25;

  const yTicks = 4;
  const tickValues = Array.from({ length: yTicks + 1 }, (_, i) => Math.round((maxVal / yTicks) * i));

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full" style={{ height: `${height}px` }} preserveAspectRatio="none">
      {tickValues.map((tv, i) => {
        const y = padding.top + chartH - (tv / maxVal) * chartH;
        return (
          <g key={i}>
            <line x1={padding.left} y1={y} x2={width - padding.right} y2={y} stroke="#243b53" strokeWidth="0.2" strokeDasharray="1" />
            <text x={padding.left - 3} y={y + 1.5} fill="#627d98" fontSize="3" textAnchor="end" fontFamily="monospace">
              {tv}
            </text>
          </g>
        );
      })}

      {data.map((d, i) => {
        const barH = (d.value / maxVal) * chartH;
        const x = padding.left + i * barWidth + barGap / 2;
        const y = padding.top + chartH - barH;
        const isHighlighted = highlightThreshold !== undefined && d.value >= highlightThreshold;
        const barColor = isHighlighted && highlightColor ? highlightColor : color;
        return (
          <g key={i}>
            <rect x={x} y={y} width={barWidth - barGap} height={barH} rx="0.8" fill={barColor} opacity={0.85} />
            <text x={x + (barWidth - barGap) / 2} y={y - 1.5} fill={barColor} fontSize="2.8" textAnchor="middle" fontFamily="monospace" fontWeight="600">
              {d.value}{unit}
            </text>
            <text x={x + (barWidth - barGap) / 2} y={height - 4} fill="#627d98" fontSize="2.5" textAnchor="middle">
              {d.label.length > 8 ? d.label.slice(0, 7) + '…' : d.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

interface ScatterPoint {
  x: number;
  y: number;
  label: string;
}

interface ScatterChartProps {
  data: ScatterPoint[];
  xLabel: string;
  yLabel: string;
  height?: number;
}

export function ScatterChart({ data, xLabel, yLabel, height = 220 }: ScatterChartProps) {
  const width = 100;
  const padding = { top: 15, right: 12, bottom: 30, left: 35 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;
  const maxX = Math.max(...data.map((d) => d.x)) * 1.1;
  const maxY = Math.max(...data.map((d) => d.y)) * 1.1;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full" style={{ height: `${height}px` }} preserveAspectRatio="none">
      {[0, 0.25, 0.5, 0.75, 1].map((f, i) => {
        const y = padding.top + chartH * (1 - f);
        return (
          <g key={`h${i}`}>
            <line x1={padding.left} y1={y} x2={width - padding.right} y2={y} stroke="#243b53" strokeWidth="0.2" strokeDasharray="1" />
            <text x={padding.left - 3} y={y + 1.5} fill="#627d98" fontSize="3" textAnchor="end" fontFamily="monospace">
              {Math.round(maxY * f)}
            </text>
          </g>
        );
      })}
      {[0, 0.25, 0.5, 0.75, 1].map((f, i) => {
        const x = padding.left + chartW * f;
        return (
          <g key={`v${i}`}>
            <line x1={x} y1={padding.top} x2={x} y2={padding.top + chartH} stroke="#243b53" strokeWidth="0.15" strokeDasharray="1" />
            <text x={x} y={height - 4} fill="#627d98" fontSize="2.5" textAnchor="middle" fontFamily="monospace">
              {Math.round(maxX * f)}
            </text>
          </g>
        );
      })}

      {data.map((d, i) => {
        const cx = padding.left + (d.x / maxX) * chartW;
        const cy = padding.top + chartH - (d.y / maxY) * chartH;
        const r = 2.5;
        const color = d.y >= 2 ? '#dc2626' : d.y >= 1 ? '#ea580c' : '#ca8a04';
        return (
          <g key={i}>
            <circle cx={cx} cy={cy} r={r} fill={color} fillOpacity="0.7" stroke={color} strokeWidth="0.5" />
            <text x={cx + r + 1} y={cy + 1} fill="#9fb3c8" fontSize="2.2" fontFamily="monospace">
              {d.label}
            </text>
          </g>
        );
      })}

      <text x={width / 2} y={height - 1} fill="#627d98" fontSize="3" textAnchor="middle">
        {xLabel}
      </text>
      <text x={5} y={height / 2} fill="#627d98" fontSize="3" textAnchor="middle" transform={`rotate(-90 5 ${height / 2})`}>
        {yLabel}
      </text>
    </svg>
  );
}
