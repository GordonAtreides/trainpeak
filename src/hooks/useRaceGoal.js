import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  calculateWeeksToRace,
  getCurrentWeekTarget,
  generateTSSRamp,
  formatRaceCountdown,
  calculateProjectedCTL,
} from '../utils/raceGoalCalculations';

const STORAGE_KEY = 'trainpeak_race_goal';

export const useRaceGoal = (currentCTL = 0, baseTSS = 0) => {
  const [raceGoal, setRaceGoal] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Check if race is still in the future
        const { isPast } = calculateWeeksToRace(parsed.raceDate);
        if (!isPast) {
          setRaceGoal(parsed);
        } else {
          // Clear past races
          localStorage.removeItem(STORAGE_KEY);
        }
      }
    } catch (error) {
      console.error('Error loading race goal:', error);
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage when race goal changes
  useEffect(() => {
    if (isLoaded) {
      if (raceGoal) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(raceGoal));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, [raceGoal, isLoaded]);

  // Set a new race goal
  const setGoal = useCallback((raceName, raceDate, raceType = 'run') => {
    const { weeks } = calculateWeeksToRace(raceDate);
    setRaceGoal({
      raceName,
      raceDate,
      raceType,
      totalWeeks: weeks,
      createdAt: new Date().toISOString(),
    });
  }, []);

  // Clear race goal
  const clearGoal = useCallback(() => {
    setRaceGoal(null);
  }, []);

  // Current week target
  const weekTarget = useMemo(() => {
    if (!raceGoal) return null;
    // Use baseTSS or fall back to a reasonable default based on current CTL
    const effectiveBaseTSS = baseTSS || Math.max(currentCTL * 7, 200);
    return getCurrentWeekTarget(raceGoal, effectiveBaseTSS);
  }, [raceGoal, baseTSS, currentCTL]);

  // Full TSS ramp plan
  const tssRamp = useMemo(() => {
    if (!raceGoal) return null;
    const effectiveBaseTSS = baseTSS || Math.max(currentCTL * 7, 200);
    return generateTSSRamp(effectiveBaseTSS, raceGoal.raceDate);
  }, [raceGoal, baseTSS, currentCTL]);

  // Countdown text
  const countdown = useMemo(() => {
    if (!raceGoal) return null;
    return formatRaceCountdown(raceGoal.raceDate, raceGoal.raceName);
  }, [raceGoal]);

  // Projected CTL on race day
  const projectedCTL = useMemo(() => {
    if (!tssRamp?.weeks) return null;
    return calculateProjectedCTL(currentCTL, tssRamp.weeks);
  }, [tssRamp, currentCTL]);

  return {
    raceGoal,
    isLoaded,
    setGoal,
    clearGoal,
    weekTarget,
    tssRamp,
    countdown,
    projectedCTL,
    hasGoal: !!raceGoal,
  };
};
