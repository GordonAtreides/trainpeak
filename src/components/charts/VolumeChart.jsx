import { useMemo } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { calculateWeeklyVolume } from '../../utils/tssCalculations';
import { useTheme } from '../../hooks/useTheme';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;

  const data = payload[0]?.payload;

  return (
    <div
      className="p-3 rounded-lg shadow-xl"
      style={{
        backgroundColor: 'var(--bg-elevated)',
        border: '1px solid var(--border)',
      }}
    >
      <p className="font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Week of {label}</p>
      <div className="space-y-1 text-sm">
        <p style={{ color: 'var(--text-secondary)' }}>Total TSS: <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{data?.totalTSS || 0}</span></p>
        <p style={{ color: 'var(--text-secondary)' }}>Duration: <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{data?.totalDuration || 0} min</span></p>
        <hr className="my-1" style={{ borderColor: 'var(--border)' }} />
        {data?.run > 0 && <p className="text-emerald-500">Run: {data.run} TSS</p>}
        {data?.bike > 0 && <p className="text-amber-500">Bike: {data.bike} TSS</p>}
        {data?.swim > 0 && <p className="text-sky-500">Swim: {data.swim} TSS</p>}
        {data?.strength > 0 && <p className="text-purple-500">Strength: {data.strength} TSS</p>}
      </div>
    </div>
  );
};

export const VolumeChart = ({ workouts, weeks = 12 }) => {
  const { isDark } = useTheme();
  const data = useMemo(() => {
    return calculateWeeklyVolume(workouts, weeks);
  }, [workouts, weeks]);

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
        Weekly Training Volume
      </h3>
      <div className="h-48 sm:h-56 lg:h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
            <XAxis
              dataKey="weekLabel"
              tick={{ fontSize: 11, fill: textColor }}
              tickLine={false}
              axisLine={{ stroke: gridColor }}
            />
            <YAxis
              tick={{ fontSize: 11, fill: textColor }}
              tickLine={false}
              axisLine={{ stroke: gridColor }}
              label={{ value: 'TSS', angle: -90, position: 'insideLeft', fontSize: 11, fill: textColor }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="top"
              height={36}
              wrapperStyle={{ fontSize: '12px' }}
            />

            <Bar dataKey="run" name="Run" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} />
            <Bar dataKey="bike" name="Bike" stackId="a" fill="#f59e0b" radius={[0, 0, 0, 0]} />
            <Bar dataKey="swim" name="Swim" stackId="a" fill="#0ea5e9" radius={[0, 0, 0, 0]} />
            <Bar dataKey="strength" name="Strength" stackId="a" fill="#a855f7" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
