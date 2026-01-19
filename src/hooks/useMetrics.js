import { useMemo } from 'react';
import { calculateMetrics, calculateWeeklyTSS, getFormStatus } from '../utils/tssCalculations';

export const useMetrics = (workouts, weekDates) => {
  const metrics = useMemo(() => {
    if (!workouts || workouts.length === 0) {
      return {
        ctl: 0,
        atl: 0,
        tsb: 0,
      };
    }
    return calculateMetrics(workouts);
  }, [workouts]);

  const weeklyTSS = useMemo(() => {
    if (!workouts || !weekDates) {
      return { planned: 0, completed: 0 };
    }
    return calculateWeeklyTSS(workouts, weekDates);
  }, [workouts, weekDates]);

  const formStatus = useMemo(() => {
    return getFormStatus(metrics.tsb);
  }, [metrics.tsb]);

  return {
    ...metrics,
    weeklyTSS,
    formStatus,
  };
};
