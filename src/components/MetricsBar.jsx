import { TrendingUp, Zap, Battery, Target } from 'lucide-react';
import { TooltipWrapper } from './Tooltip';

const TOOLTIPS = {
  fitness: "CTL (Chronic Training Load) is your 42-day rolling average TSS. It represents your aerobic base and long-term fitness. Higher = more trained. Takes weeks to build, days to lose.",
  fatigue: "ATL (Acute Training Load) is your 7-day rolling average TSS. It shows how much stress you've accumulated recently. High fatigue needs recovery time.",
  form: "TSB (Training Stress Balance) = Fitness minus Fatigue. Negative means you're tired but building fitness. Positive means you're fresh and ready to perform. Race day target: +15 to +25.",
  weekTss: "TSS (Training Stress Score) measures workout intensity and duration combined. 100 TSS = 1 hour at threshold effort. Track weekly totals to manage load.",
};

const MetricCard = ({ icon: Icon, label, value, subValue, color, tooltip, gradient }) => (
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

    <div className="flex items-start justify-between">
      <div>
        <TooltipWrapper content={tooltip}>
          <p className="text-xs font-medium uppercase tracking-wider cursor-help mb-1" style={{ color: 'var(--text-muted)' }}>
            {label}
          </p>
        </TooltipWrapper>
        <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{value}</p>
        {subValue && (
          <p className="text-sm font-medium mt-0.5" style={{ color }}>{subValue}</p>
        )}
      </div>
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center"
        style={{ background: `${gradient}20` }}
      >
        <Icon className="w-5 h-5" style={{ color }} />
      </div>
    </div>
  </div>
);

export const MetricsBar = ({ ctl, atl, tsb, formStatus, weeklyTSS, compact = false }) => {
  const progressPercent = weeklyTSS.planned > 0
    ? Math.min(100, Math.round((weeklyTSS.completed / weeklyTSS.planned) * 100))
    : 0;

  const getFormColor = () => {
    if (tsb > 5) return '#22c55e';
    if (tsb < -10) return '#ef4444';
    return '#eab308';
  };

  return (
    <div className={`grid gap-3 ${compact ? 'grid-cols-2' : 'grid-cols-2 lg:grid-cols-4'}`}>
      {/* Fitness */}
      <MetricCard
        icon={TrendingUp}
        label="Fitness"
        value={ctl.toFixed(1)}
        tooltip={TOOLTIPS.fitness}
        color="#10b981"
        gradient="linear-gradient(135deg, #10b981, #059669)"
      />

      {/* Fatigue */}
      <MetricCard
        icon={Zap}
        label="Fatigue"
        value={atl.toFixed(1)}
        tooltip={TOOLTIPS.fatigue}
        color="#f59e0b"
        gradient="linear-gradient(135deg, #f59e0b, #d97706)"
      />

      {/* Form */}
      <MetricCard
        icon={Battery}
        label="Form"
        value={`${tsb > 0 ? '+' : ''}${tsb.toFixed(1)}`}
        subValue={formStatus.label}
        tooltip={TOOLTIPS.form}
        color={getFormColor()}
        gradient={`linear-gradient(135deg, ${getFormColor()}, ${getFormColor()})`}
      />

      {/* Weekly TSS */}
      <div
        className="relative rounded-xl p-4"
        style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border)',
        }}
      >
        {/* Progress bar as background */}
        <div
          className="absolute bottom-0 left-0 h-1 rounded-b-xl transition-all duration-500"
          style={{
            width: `${progressPercent}%`,
            background: 'linear-gradient(90deg, #fc4c02, #ff6b2b)',
          }}
        />

        <div className="flex items-start justify-between">
          <div>
            <TooltipWrapper content={TOOLTIPS.weekTss}>
              <p className="text-xs font-medium uppercase tracking-wider cursor-help mb-1" style={{ color: 'var(--text-muted)' }}>
                Week TSS
              </p>
            </TooltipWrapper>
            <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
              {weeklyTSS.completed}
              <span className="text-sm font-normal ml-1" style={{ color: 'var(--text-muted)' }}>/ {weeklyTSS.planned}</span>
            </p>
            <p className="text-sm font-medium mt-0.5" style={{ color: '#fc4c02' }}>
              {progressPercent}%
            </p>
          </div>
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ background: 'rgba(252, 76, 2, 0.15)' }}
          >
            <Target className="w-5 h-5" style={{ color: '#fc4c02' }} />
          </div>
        </div>
      </div>
    </div>
  );
};
