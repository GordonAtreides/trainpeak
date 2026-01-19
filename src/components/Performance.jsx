import { useState, useMemo } from 'react';
import { TrendingUp, Activity, Clock, Zap } from 'lucide-react';
import { PMCChart } from './charts/PMCChart';
import { VolumeChart } from './charts/VolumeChart';
import { ProgressionAlert } from './ProgressionAlert';
import { WeeklyVerdict } from './WeeklyVerdict';
import { calculateMetrics } from '../utils/tssCalculations';

const StatCard = ({ icon: Icon, label, value, subValue, color, gradient }) => (
  <div
    className="relative rounded-xl p-4"
    style={{
      backgroundColor: 'var(--bg-card)',
      border: '1px solid var(--border)',
    }}
  >
    {/* Gradient accent */}
    <div
      className="absolute top-0 left-0 w-full h-1 rounded-t-xl"
      style={{ background: gradient }}
    />

    <div className="flex items-center gap-3">
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center"
        style={{ background: `${gradient}20` }}
      >
        <Icon size={20} style={{ color }} />
      </div>
      <div>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{label}</p>
        <p className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{value}</p>
        {subValue && <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{subValue}</p>}
      </div>
    </div>
  </div>
);

export const Performance = ({ workouts, guardrails, raceGoal, onSetGoalClick }) => {
  const [timeRange, setTimeRange] = useState(90);

  const currentMetrics = useMemo(() => {
    return calculateMetrics(workouts);
  }, [workouts]);

  // Calculate summary stats
  const stats = useMemo(() => {
    const now = new Date();
    const rangeStart = new Date(now);
    rangeStart.setDate(rangeStart.getDate() - timeRange);
    const rangeStartStr = rangeStart.toISOString().split('T')[0];

    const rangeWorkouts = workouts.filter(w =>
      w.date >= rangeStartStr && w.completed
    );

    const totalTSS = rangeWorkouts.reduce((sum, w) => sum + (w.completed?.tss || 0), 0);
    const totalDuration = rangeWorkouts.reduce((sum, w) => sum + (w.completed?.duration || 0), 0);
    const totalActivities = rangeWorkouts.length;

    return {
      totalTSS,
      totalDuration,
      totalActivities,
      avgTSSPerWeek: Math.round(totalTSS / (timeRange / 7)),
    };
  }, [workouts, timeRange]);

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Performance</h1>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Track your fitness, fatigue, and form</p>
        </div>

        {/* Time Range Selector */}
        <div className="flex items-center gap-1 p-1 rounded-lg self-start sm:self-auto" style={{ backgroundColor: 'var(--bg-card)' }}>
          {[7, 30, 60, 90].map((days) => (
            <button
              key={days}
              onClick={() => setTimeRange(days)}
              className="px-3 py-1.5 text-sm font-medium rounded-md transition-all"
              style={timeRange === days ? {
                background: 'linear-gradient(135deg, #fc4c02, #ff6b2b)',
                color: 'white',
              } : {
                color: 'var(--text-secondary)',
              }}
            >
              {days}d
            </button>
          ))}
        </div>
      </div>

      {/* Weekly Analysis Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <ProgressionAlert
          guardrails={guardrails}
          raceGoal={raceGoal}
          currentWeekTSS={guardrails.currentWeekTSS}
          onSetGoalClick={onSetGoalClick}
        />
        <WeeklyVerdict workouts={workouts} />
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          icon={TrendingUp}
          label="Current Fitness"
          value={currentMetrics.ctl}
          subValue="CTL"
          color="#0ea5e9"
          gradient="linear-gradient(135deg, #0ea5e9, #0284c7)"
        />
        <StatCard
          icon={Zap}
          label="Current Form"
          value={currentMetrics.tsb}
          subValue={currentMetrics.tsb > 0 ? 'Fresh' : 'Fatigued'}
          color={currentMetrics.tsb > 0 ? '#22c55e' : '#f59e0b'}
          gradient={currentMetrics.tsb > 0
            ? 'linear-gradient(135deg, #22c55e, #16a34a)'
            : 'linear-gradient(135deg, #f59e0b, #d97706)'
          }
        />
        <StatCard
          icon={Activity}
          label="Activities"
          value={stats.totalActivities}
          subValue={`Last ${timeRange} days`}
          color="#a855f7"
          gradient="linear-gradient(135deg, #a855f7, #9333ea)"
        />
        <StatCard
          icon={Clock}
          label="Training Time"
          value={`${Math.round(stats.totalDuration / 60)}h`}
          subValue={`${stats.totalDuration} min total`}
          color="#fc4c02"
          gradient="linear-gradient(135deg, #fc4c02, #ff6b2b)"
        />
      </div>

      {/* Charts */}
      <div className="space-y-6">
        <PMCChart workouts={workouts} days={timeRange} />
        <VolumeChart workouts={workouts} weeks={Math.max(8, Math.ceil(timeRange / 7))} />
      </div>
    </div>
  );
};
