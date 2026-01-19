import { useMemo } from 'react';
import { calculateAllGuardrails } from '../utils/guardrailsCalculations';
import { calculateMetrics } from '../utils/tssCalculations';

export const useGuardrails = (workouts, weeklyTarget = null) => {
  const guardrails = useMemo(() => {
    if (!workouts || workouts.length === 0) {
      return {
        status: 'good',
        warnings: [],
        cautions: [],
        positives: [],
        recommendation: null,
        details: {},
      };
    }

    // Calculate current and previous week CTL for trend
    const today = new Date();
    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);

    const currentMetrics = calculateMetrics(workouts, today.toISOString().split('T')[0]);
    const previousMetrics = calculateMetrics(workouts, lastWeek.toISOString().split('T')[0]);

    return calculateAllGuardrails(
      workouts,
      currentMetrics.ctl,
      previousMetrics.ctl,
      weeklyTarget
    );
  }, [workouts, weeklyTarget]);

  // Get current week TSS
  const currentWeekTSS = useMemo(() => {
    if (!workouts || workouts.length === 0) return 0;

    const today = new Date();
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(today.setDate(diff));
    const mondayStr = monday.toISOString().split('T')[0];

    const sunday = new Date(monday);
    sunday.setDate(sunday.getDate() + 6);
    const sundayStr = sunday.toISOString().split('T')[0];

    return workouts
      .filter(w => w.date >= mondayStr && w.date <= sundayStr && w.completed)
      .reduce((sum, w) => sum + (w.completed?.tss || 0), 0);
  }, [workouts]);

  return {
    ...guardrails,
    currentWeekTSS,
  };
};
