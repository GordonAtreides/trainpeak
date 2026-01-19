import { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle,
  Target,
  ChevronDown,
  ChevronUp,
  TrendingUp,
  Calendar,
  Plus,
} from 'lucide-react';
import { TooltipWrapper } from './Tooltip';

const PHASE_TOOLTIPS = {
  Build: "Building base fitness with gradual load increases (+7% weekly). Focus on consistency and volume.",
  Peak: "Highest training load week. Final push before tapering. Expect fatigue.",
  Taper: "Reducing volume to shed fatigue while maintaining fitness. Trust the process!",
  Race: "Race week! Minimal training to arrive fresh. Target form: +15 to +25.",
};

const PHASE_COLORS = {
  Build: { bg: 'rgba(16, 185, 129, 0.15)', text: '#10b981' },
  Peak: { bg: 'rgba(245, 158, 11, 0.15)', text: '#f59e0b' },
  Taper: { bg: 'rgba(14, 165, 233, 0.15)', text: '#0ea5e9' },
  Race: { bg: 'rgba(252, 76, 2, 0.15)', text: '#fc4c02' },
};

export const ProgressionAlert = ({
  guardrails,
  raceGoal,
  currentWeekTSS,
  onSetGoalClick,
}) => {
  const [expanded, setExpanded] = useState(false);

  const { status, warnings, cautions, positives, recommendation } = guardrails;
  const { weekTarget, countdown, hasGoal } = raceGoal;

  // Determine header style based on status
  const getHeaderStyle = () => {
    if (warnings.length > 0) {
      return { bg: 'rgba(239, 68, 68, 0.1)', border: 'rgba(239, 68, 68, 0.3)' };
    }
    if (cautions.length > 0) {
      return { bg: 'rgba(245, 158, 11, 0.1)', border: 'rgba(245, 158, 11, 0.3)' };
    }
    return { bg: 'rgba(34, 197, 94, 0.1)', border: 'rgba(34, 197, 94, 0.3)' };
  };

  const getStatusIcon = () => {
    if (warnings.length > 0) {
      return <AlertTriangle className="w-5 h-5 text-red-500" />;
    }
    if (cautions.length > 0) {
      return <AlertTriangle className="w-5 h-5 text-amber-500" />;
    }
    return <CheckCircle className="w-5 h-5 text-emerald-500" />;
  };

  // Progress bar for weekly target
  const progressPercent = weekTarget
    ? Math.min((currentWeekTSS / weekTarget.targetTSS) * 100, 100)
    : 0;

  const headerStyle = getHeaderStyle();
  const phaseColor = weekTarget ? PHASE_COLORS[weekTarget.phaseInfo.label] : null;

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        backgroundColor: headerStyle.bg,
        border: `1px solid ${headerStyle.border}`,
      }}
    >
      {/* Main Content */}
      <div className="p-4">
        {/* Race Goal Header (if set) */}
        {hasGoal && countdown && !countdown.isPast && (
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5" style={{ color: '#fc4c02' }} />
              <span className="font-semibold text-white">{countdown.text}</span>
              {weekTarget && phaseColor && (
                <TooltipWrapper content={PHASE_TOOLTIPS[weekTarget.phaseInfo.label] || "Training phase based on weeks until race"}>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full cursor-help font-medium"
                    style={{
                      backgroundColor: phaseColor.bg,
                      color: phaseColor.text,
                    }}
                  >
                    {weekTarget.phaseInfo.label}
                  </span>
                </TooltipWrapper>
              )}
            </div>
          </div>
        )}

        {/* Progress Bar (if race goal set) */}
        {hasGoal && weekTarget && (
          <div className="mb-3">
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-zinc-400">
                This week: {currentWeekTSS} / {weekTarget.targetTSS} TSS
              </span>
              <span className="text-zinc-500">{Math.round(progressPercent)}%</span>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${progressPercent}%`,
                  background: progressPercent >= 90
                    ? 'linear-gradient(90deg, #10b981, #059669)'
                    : progressPercent >= 70
                    ? 'linear-gradient(90deg, #f59e0b, #d97706)'
                    : 'linear-gradient(90deg, #fc4c02, #ff6b2b)',
                }}
              />
            </div>
          </div>
        )}

        {/* No Race Goal - Show basic stats */}
        {!hasGoal && (
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-zinc-500" />
              <span className="font-medium text-white">
                This Week: {currentWeekTSS} TSS
              </span>
            </div>
            <button
              onClick={onSetGoalClick}
              className="flex items-center gap-1 text-sm font-medium transition-colors"
              style={{ color: '#fc4c02' }}
            >
              <Plus size={16} />
              Set Race Goal
            </button>
          </div>
        )}

        {/* Status Line */}
        <div className="flex items-center gap-2 flex-wrap">
          {getStatusIcon()}

          {/* Positives */}
          {positives.length > 0 && (
            <div className="flex items-center gap-2 text-sm text-zinc-400">
              {positives.map((positive, i) => (
                <span key={i} className="flex items-center gap-1">
                  {i > 0 && <span className="text-zinc-600">•</span>}
                  {positive}
                </span>
              ))}
            </div>
          )}

          {/* Show warning count if collapsed */}
          {!expanded && (warnings.length > 0 || cautions.length > 0) && (
            <span className={`text-sm ${warnings.length > 0 ? 'text-red-400' : 'text-amber-400'}`}>
              {warnings.length + cautions.length} alert{warnings.length + cautions.length > 1 ? 's' : ''}
            </span>
          )}

          {/* Expand toggle */}
          {(warnings.length > 0 || cautions.length > 0 || recommendation) && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="ml-auto flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              {expanded ? 'Less' : 'Details'}
            </button>
          )}
        </div>

        {/* Expanded Details */}
        {expanded && (
          <div className="mt-3 pt-3 space-y-2" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            {/* Warnings */}
            {warnings.map((warning, i) => (
              <div key={`w-${i}`} className="flex items-start gap-2 text-sm">
                <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                <span className="text-red-400">{warning}</span>
              </div>
            ))}

            {/* Cautions */}
            {cautions.map((caution, i) => (
              <div key={`c-${i}`} className="flex items-start gap-2 text-sm">
                <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                <span className="text-amber-400">{caution}</span>
              </div>
            ))}

            {/* Recommendation */}
            {recommendation && (
              <div
                className="flex items-start gap-2 text-sm p-2 rounded-lg mt-2"
                style={{ backgroundColor: 'rgba(14, 165, 233, 0.15)' }}
              >
                <TrendingUp className="w-4 h-4 text-sky-400 mt-0.5 flex-shrink-0" />
                <span className="text-sky-300">{recommendation}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
