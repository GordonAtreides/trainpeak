import { useMemo } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from 'recharts';
import { calculateHistoricalMetrics } from '../../utils/tssCalculations';
import { useTheme } from '../../hooks/useTheme';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div
      className="p-3 rounded-lg shadow-xl"
      style={{
        backgroundColor: 'var(--bg-elevated)',
        border: '1px solid var(--border)',
      }}
    >
      <p className="font-medium mb-2" style={{ color: 'var(--text-primary)' }}>{formatDate(label)}</p>
      {payload.map((entry, index) => (
        <p key={index} className="text-sm" style={{ color: entry.color }}>
          {entry.name}: {entry.value}
        </p>
      ))}
    </div>
  );
};

export const PMCChart = ({ workouts, days = 90 }) => {
  const { isDark } = useTheme();
  const data = useMemo(() => {
    return calculateHistoricalMetrics(workouts, days);
  }, [workouts, days]);

  const formatXAxis = (dateStr) => {
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  // Calculate domain for Y axis
  const allValues = data.flatMap(d => [d.ctl, d.atl, d.tsb]);
  const minValue = Math.min(...allValues, 0);
  const maxValue = Math.max(...allValues);
  const padding = (maxValue - minValue) * 0.1;

  // Theme-aware chart colors
  const gridColor = isDark ? '#3f3f46' : '#e4e4e7';
  const textColor = isDark ? '#71717a' : '#71717a';

  return (
    <div
      className="rounded-xl p-4"
      style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border)',
      }}
    >
      <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
        Performance Management Chart
      </h3>
      <div className="h-56 sm:h-64 lg:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis
              dataKey="date"
              tickFormatter={formatXAxis}
              tick={{ fontSize: 11, fill: textColor }}
              tickLine={false}
              axisLine={{ stroke: gridColor }}
              interval="preserveStartEnd"
              minTickGap={40}
            />
            <YAxis
              tick={{ fontSize: 11, fill: textColor }}
              tickLine={false}
              axisLine={{ stroke: gridColor }}
              domain={[Math.floor(minValue - padding), Math.ceil(maxValue + padding)]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="top"
              height={36}
              iconType="line"
              wrapperStyle={{ fontSize: '12px' }}
            />
            <ReferenceLine y={0} stroke="#9ca3af" strokeDasharray="3 3" />

            {/* TSB Area (Form) */}
            <Area
              type="monotone"
              dataKey="tsb"
              name="Form (TSB)"
              fill="#fef08a"
              fillOpacity={0.3}
              stroke="#eab308"
              strokeWidth={2}
            />

            {/* CTL Line (Fitness) */}
            <Line
              type="monotone"
              dataKey="ctl"
              name="Fitness (CTL)"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: '#3b82f6' }}
            />

            {/* ATL Line (Fatigue) */}
            <Line
              type="monotone"
              dataKey="atl"
              name="Fatigue (ATL)"
              stroke="#f43f5e"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: '#f43f5e' }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 flex flex-wrap gap-3 sm:gap-4 text-xs" style={{ color: 'var(--text-muted)' }}>
        <span><span className="inline-block w-3 h-0.5 bg-blue-500 mr-1"></span> CTL: Fitness</span>
        <span><span className="inline-block w-3 h-0.5 bg-rose-500 mr-1"></span> ATL: Fatigue</span>
        <span><span className="inline-block w-3 h-3 bg-yellow-200/30 border border-yellow-400 mr-1"></span> TSB: Form</span>
      </div>
    </div>
  );
};
