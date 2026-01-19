import { useMemo } from 'react';
import { CheckCircle, AlertTriangle, ArrowRight, Activity } from 'lucide-react';
import { calculateWeeklyVerdict } from '../utils/guardrailsCalculations';
import { TooltipWrapper } from './Tooltip';

const VERDICT_TOOLTIPS = {
  productive: "Great week! Good training load with proper distribution. You're building fitness effectively.",
  neutral: "Okay week. Some aspects were good, others could improve. Check the details below.",
  risky: "Caution! Training load spiked too fast or had other risk factors. Consider recovery.",
  underloaded: "Light week. This is fine for recovery, but won't build much fitness if repeated.",
  recovery: "Planned recovery week. Lower volume to absorb previous training and prevent burnout.",
};

const VerdictBadge = ({ verdict, emoji }) => {
  const colors = {
    productive: { bg: 'rgba(16, 185, 129, 0.15)', text: '#10b981', border: 'rgba(16, 185, 129, 0.3)' },
    neutral: { bg: 'rgba(245, 158, 11, 0.15)', text: '#f59e0b', border: 'rgba(245, 158, 11, 0.3)' },
    risky: { bg: 'rgba(239, 68, 68, 0.15)', text: '#ef4444', border: 'rgba(239, 68, 68, 0.3)' },
    underloaded: { bg: 'rgba(113, 113, 122, 0.15)', text: '#a1a1aa', border: 'rgba(113, 113, 122, 0.3)' },
    recovery: { bg: 'rgba(14, 165, 233, 0.15)', text: '#0ea5e9', border: 'rgba(14, 165, 233, 0.3)' },
  };

  const color = colors[verdict] || colors.neutral;

  return (
    <TooltipWrapper content={VERDICT_TOOLTIPS[verdict] || "Weekly training assessment"}>
      <span
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-sm font-medium cursor-help"
        style={{
          backgroundColor: color.bg,
          color: color.text,
          border: `1px solid ${color.border}`,
        }}
      >
        <span>{emoji}</span>
        <span>{verdict.charAt(0).toUpperCase() + verdict.slice(1)}</span>
      </span>
    </TooltipWrapper>
  );
};

export const WeeklyVerdict = ({ workouts }) => {
  const verdict = useMemo(() => {
    if (!workouts || workouts.length === 0) return null;
    return calculateWeeklyVerdict(workouts);
  }, [workouts]);

  if (!verdict || (verdict.stats.tss === 0 && verdict.stats.sessions === 0)) {
    return null;
  }

  // Format week range
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div
      className="rounded-xl p-4"
      style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border)',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-zinc-500" />
          <span className="text-sm text-zinc-500">
            Last Week ({formatDate(verdict.weekRange.start)} - {formatDate(verdict.weekRange.end)})
          </span>
        </div>
        <VerdictBadge verdict={verdict.verdict} emoji={verdict.emoji} />
      </div>

      {/* Stats summary */}
      <div className="flex items-center gap-4 text-sm text-zinc-400 mb-3">
        <span>{verdict.stats.tss} TSS</span>
        <span className="text-zinc-600">•</span>
        <span>{verdict.stats.sessions} sessions</span>
        <span className="text-zinc-600">•</span>
        <span>{verdict.stats.days} days</span>
        {verdict.stats.loadChange !== 0 && (
          <>
            <span className="text-zinc-600">•</span>
            <TooltipWrapper content="Compared to your 4-week rolling average. Safe progression is typically +5-10% per week. Jumps over 20% increase injury risk.">
              <span
                className="cursor-help border-b border-dotted"
                style={{
                  color: verdict.stats.loadChange > 0 ? '#10b981' : '#f59e0b',
                  borderColor: verdict.stats.loadChange > 0 ? 'rgba(16, 185, 129, 0.5)' : 'rgba(245, 158, 11, 0.5)',
                }}
              >
                {verdict.stats.loadChange > 0 ? '+' : ''}{verdict.stats.loadChange}% vs avg
              </span>
            </TooltipWrapper>
          </>
        )}
      </div>

      {/* Reasons and warnings */}
      <div className="space-y-1.5 mb-3">
        {verdict.reasons.map((reason, i) => (
          <div key={`r-${i}`} className="flex items-center gap-2 text-sm">
            <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
            <span className="text-zinc-300">{reason}</span>
          </div>
        ))}
        {verdict.warnings.map((warning, i) => (
          <div key={`w-${i}`} className="flex items-center gap-2 text-sm">
            <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" />
            <span className="text-zinc-300">{warning}</span>
          </div>
        ))}
      </div>

      {/* Suggestion */}
      {verdict.suggestion && (
        <div
          className="flex items-center gap-2 text-sm rounded-lg px-3 py-2"
          style={{ backgroundColor: 'var(--bg-elevated)' }}
        >
          <ArrowRight className="w-4 h-4 flex-shrink-0" style={{ color: '#fc4c02' }} />
          <span className="text-zinc-300">
            <span className="font-medium text-white">Next week:</span> {verdict.suggestion.toLowerCase().replace('next week:', '').trim()}
          </span>
        </div>
      )}
    </div>
  );
};
