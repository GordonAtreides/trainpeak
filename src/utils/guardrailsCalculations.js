// Guardrails and progression calculations

const HARD_DAY_TSS_THRESHOLD = 75;
const VOLUME_SPIKE_CAUTION = 1.10; // 110%
const VOLUME_SPIKE_WARNING = 1.30; // 130%
const LONG_RUN_CREEP_THRESHOLD = 1.15; // 115%
const MONOTONY_THRESHOLD = 0.80; // 80%

// Helper: Get week boundaries (Monday-Sunday)
const getWeekBounds = (date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Monday
  const monday = new Date(d.setDate(diff));
  monday.setHours(0, 0, 0, 0);
  const sunday = new Date(monday);
  sunday.setDate(sunday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);
  return { start: monday, end: sunday };
};

// Helper: Get date string
const toDateStr = (date) => {
  return new Date(date).toISOString().split('T')[0];
};

// Helper: Get TSS for a specific date
const getDayTSS = (workouts, dateStr) => {
  return workouts
    .filter(w => w.date === dateStr && w.completed)
    .reduce((sum, w) => sum + (w.completed?.tss || 0), 0);
};

// Helper: Get weekly TSS totals for last N weeks
const getWeeklyTSSTotals = (workouts, weeks = 4) => {
  const today = new Date();
  const totals = [];

  for (let w = 0; w < weeks; w++) {
    const weekEnd = new Date(today);
    weekEnd.setDate(weekEnd.getDate() - (w * 7));
    const { start, end } = getWeekBounds(weekEnd);

    const startStr = toDateStr(start);
    const endStr = toDateStr(end);

    const weekTSS = workouts
      .filter(w => w.date >= startStr && w.date <= endStr && w.completed)
      .reduce((sum, w) => sum + (w.completed?.tss || 0), 0);

    totals.unshift({ week: w, startDate: startStr, tss: weekTSS });
  }

  return totals;
};

// 1. Volume Spike Detection
export const calculateVolumeSpike = (workouts) => {
  const weeklyTotals = getWeeklyTSSTotals(workouts, 5); // Current + 4 previous

  if (weeklyTotals.length < 2) {
    return { status: 'ok', percentage: 0, message: null };
  }

  const currentWeek = weeklyTotals[weeklyTotals.length - 1];
  const previousWeeks = weeklyTotals.slice(0, -1);
  const avgPreviousTSS = previousWeeks.reduce((sum, w) => sum + w.tss, 0) / previousWeeks.length;

  if (avgPreviousTSS === 0) {
    return { status: 'ok', percentage: 0, message: null };
  }

  const ratio = currentWeek.tss / avgPreviousTSS;
  const percentage = Math.round((ratio - 1) * 100);

  if (ratio >= VOLUME_SPIKE_WARNING) {
    return {
      status: 'warning',
      percentage,
      currentTSS: currentWeek.tss,
      avgTSS: Math.round(avgPreviousTSS),
      message: `Weekly volume up ${percentage}% (recommended max: 10%)`,
      recommendation: Math.round(avgPreviousTSS * 1.10),
    };
  }

  if (ratio >= VOLUME_SPIKE_CAUTION) {
    return {
      status: 'caution',
      percentage,
      currentTSS: currentWeek.tss,
      avgTSS: Math.round(avgPreviousTSS),
      message: `Weekly volume up ${percentage}% - approaching limit`,
      recommendation: Math.round(avgPreviousTSS * 1.10),
    };
  }

  return { status: 'ok', percentage, message: null };
};

// 2. Intensity Stacking (consecutive hard days)
export const detectIntensityStacking = (workouts) => {
  const today = new Date();
  let maxConsecutive = 0;
  let currentStreak = 0;

  // Check last 14 days
  for (let i = 13; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = toDateStr(date);

    const dayTSS = getDayTSS(workouts, dateStr);

    if (dayTSS >= HARD_DAY_TSS_THRESHOLD) {
      currentStreak++;
      maxConsecutive = Math.max(maxConsecutive, currentStreak);
    } else {
      currentStreak = 0;
    }
  }

  if (maxConsecutive > 2) {
    return {
      status: 'warning',
      consecutiveDays: maxConsecutive,
      message: `${maxConsecutive} hard days in a row - consider a recovery day`,
    };
  }

  if (maxConsecutive === 2) {
    return {
      status: 'caution',
      consecutiveDays: maxConsecutive,
      message: `2 hard days back-to-back`,
    };
  }

  return { status: 'ok', consecutiveDays: maxConsecutive, message: null };
};

// 3. Long Run Creep
export const detectLongRunCreep = (workouts) => {
  const today = new Date();
  const weeklyLongestRuns = [];

  // Get longest run for each of last 5 weeks
  for (let w = 0; w < 5; w++) {
    const weekEnd = new Date(today);
    weekEnd.setDate(weekEnd.getDate() - (w * 7));
    const { start, end } = getWeekBounds(weekEnd);

    const startStr = toDateStr(start);
    const endStr = toDateStr(end);

    const runs = workouts.filter(
      w => w.date >= startStr && w.date <= endStr &&
      w.completed && w.planned?.type === 'run'
    );

    const longestRun = runs.length > 0
      ? Math.max(...runs.map(r => r.completed?.duration || 0))
      : 0;

    weeklyLongestRuns.unshift(longestRun);
  }

  const currentWeekLongest = weeklyLongestRuns[weeklyLongestRuns.length - 1];
  const previousWeeks = weeklyLongestRuns.slice(0, -1).filter(d => d > 0);

  if (previousWeeks.length === 0 || currentWeekLongest === 0) {
    return { status: 'ok', percentage: 0, message: null };
  }

  const avgLongest = previousWeeks.reduce((sum, d) => sum + d, 0) / previousWeeks.length;
  const ratio = currentWeekLongest / avgLongest;
  const percentage = Math.round((ratio - 1) * 100);

  if (ratio >= LONG_RUN_CREEP_THRESHOLD) {
    return {
      status: 'warning',
      percentage,
      currentDuration: currentWeekLongest,
      avgDuration: Math.round(avgLongest),
      message: `Long run up ${percentage}% vs recent average`,
    };
  }

  return { status: 'ok', percentage, message: null };
};

// 4. Hard Day Clustering (too many hard days in 7-day window)
export const detectHardDayClustering = (workouts) => {
  const today = new Date();
  let maxHardDays = 0;

  // Check rolling 7-day windows over last 14 days
  for (let offset = 0; offset <= 7; offset++) {
    let hardDays = 0;

    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - offset - i);
      const dateStr = toDateStr(date);

      const dayTSS = getDayTSS(workouts, dateStr);
      if (dayTSS >= HARD_DAY_TSS_THRESHOLD) {
        hardDays++;
      }
    }

    maxHardDays = Math.max(maxHardDays, hardDays);
  }

  if (maxHardDays > 3) {
    return {
      status: 'warning',
      count: maxHardDays,
      message: `${maxHardDays} hard days in 7-day window (max recommended: 3)`,
    };
  }

  if (maxHardDays === 3) {
    return {
      status: 'caution',
      count: maxHardDays,
      message: `3 hard days this week - at the limit`,
    };
  }

  return { status: 'ok', count: maxHardDays, message: null };
};

// 5. Monotony (lack of variety)
export const calculateMonotony = (workouts) => {
  const { start, end } = getWeekBounds(new Date());
  const startStr = toDateStr(start);
  const endStr = toDateStr(end);

  const weekWorkouts = workouts.filter(
    w => w.date >= startStr && w.date <= endStr && w.completed
  );

  const tssByType = { run: 0, bike: 0, swim: 0, strength: 0 };

  weekWorkouts.forEach(w => {
    const type = w.planned?.type || 'run';
    const tss = w.completed?.tss || 0;
    if (type in tssByType) {
      tssByType[type] += tss;
    }
  });

  const totalTSS = Object.values(tssByType).reduce((sum, v) => sum + v, 0);

  if (totalTSS === 0) {
    return { status: 'ok', dominantType: null, percentage: 0, message: null };
  }

  const maxType = Object.entries(tssByType).reduce((max, [type, tss]) =>
    tss > max.tss ? { type, tss } : max, { type: null, tss: 0 }
  );

  const percentage = Math.round((maxType.tss / totalTSS) * 100);

  if (percentage >= MONOTONY_THRESHOLD * 100) {
    return {
      status: 'warning',
      dominantType: maxType.type,
      percentage,
      message: `${percentage}% of training is ${maxType.type} - consider variety`,
    };
  }

  return { status: 'ok', dominantType: maxType.type, percentage, message: null };
};

// 6. Calculate CTL trend (week over week)
export const calculateCTLTrend = (currentCTL, previousCTL) => {
  const change = currentCTL - previousCTL;
  const direction = change > 0 ? 'up' : change < 0 ? 'down' : 'stable';

  return {
    change: Math.round(change * 10) / 10,
    direction,
    message: direction === 'up'
      ? `Fitness ↑ ${Math.abs(change).toFixed(1)}`
      : direction === 'down'
        ? `Fitness ↓ ${Math.abs(change).toFixed(1)}`
        : 'Fitness stable',
  };
};

// 7. Calculate consistency streak
export const calculateConsistencyStreak = (workouts, weeklyTarget = null) => {
  const today = new Date();
  let streak = 0;

  // Check last 12 weeks
  for (let w = 0; w < 12; w++) {
    const weekEnd = new Date(today);
    weekEnd.setDate(weekEnd.getDate() - (w * 7));
    const { start, end } = getWeekBounds(weekEnd);

    const startStr = toDateStr(start);
    const endStr = toDateStr(end);

    const weekTSS = workouts
      .filter(wk => wk.date >= startStr && wk.date <= endStr && wk.completed)
      .reduce((sum, wk) => sum + (wk.completed?.tss || 0), 0);

    // If no target, just check if they trained (>50 TSS)
    const target = weeklyTarget || 50;
    const hitTarget = weekTSS >= target * 0.8; // 80% threshold

    if (hitTarget) {
      streak++;
    } else {
      break;
    }
  }

  return {
    weeks: streak,
    message: streak > 0 ? `${streak}-week consistency streak` : null,
  };
};

// 8. Calculate Weekly Verdict (Was last week productive?)
export const calculateWeeklyVerdict = (workouts) => {
  const today = new Date();

  // Get last completed week (Monday-Sunday before current week)
  const currentDay = today.getDay();
  const daysToLastSunday = currentDay === 0 ? 7 : currentDay;

  const lastSunday = new Date(today);
  lastSunday.setDate(today.getDate() - daysToLastSunday);
  lastSunday.setHours(23, 59, 59, 999);

  const lastMonday = new Date(lastSunday);
  lastMonday.setDate(lastSunday.getDate() - 6);
  lastMonday.setHours(0, 0, 0, 0);

  const lastMondayStr = toDateStr(lastMonday);
  const lastSundayStr = toDateStr(lastSunday);

  // Get workouts from last week
  const lastWeekWorkouts = workouts.filter(
    w => w.date >= lastMondayStr && w.date <= lastSundayStr && w.completed
  );

  // Calculate metrics for last week
  const lastWeekTSS = lastWeekWorkouts.reduce((sum, w) => sum + (w.completed?.tss || 0), 0);
  const lastWeekSessions = lastWeekWorkouts.length;
  const lastWeekDays = new Set(lastWeekWorkouts.map(w => w.date)).size;

  // Count hard days (TSS > 75)
  const hardDays = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(lastMonday);
    date.setDate(lastMonday.getDate() + i);
    const dateStr = toDateStr(date);
    const dayTSS = getDayTSS(workouts, dateStr);
    if (dayTSS >= HARD_DAY_TSS_THRESHOLD) {
      hardDays.push({ date: dateStr, dayIndex: i, tss: dayTSS });
    }
  }

  // Check for back-to-back hard days
  let backToBackHard = false;
  for (let i = 1; i < hardDays.length; i++) {
    if (hardDays[i].dayIndex - hardDays[i-1].dayIndex === 1) {
      backToBackHard = true;
      break;
    }
  }

  // Get previous 4 weeks for comparison
  const weeklyTotals = getWeeklyTSSTotals(workouts, 5);
  const previousWeeks = weeklyTotals.slice(0, -1);
  const avgPreviousTSS = previousWeeks.length > 0
    ? previousWeeks.reduce((sum, w) => sum + w.tss, 0) / previousWeeks.length
    : 0;
  const avgPreviousSessions = previousWeeks.length > 0
    ? previousWeeks.reduce((sum, w) => {
        const start = w.startDate;
        const end = new Date(start);
        end.setDate(end.getDate() + 6);
        const endStr = toDateStr(end);
        return sum + workouts.filter(wk => wk.date >= start && wk.date <= endStr && wk.completed).length;
      }, 0) / previousWeeks.length
    : 0;

  // Calculate load change percentage
  const loadChange = avgPreviousTSS > 0
    ? Math.round(((lastWeekTSS - avgPreviousTSS) / avgPreviousTSS) * 100)
    : 0;

  // Build verdict
  const reasons = [];
  const warnings = [];
  let verdict = 'neutral';
  let emoji = '🟡';
  let suggestion = '';

  // Analyze load change
  if (loadChange >= 5 && loadChange <= 15) {
    reasons.push(`Load increased +${loadChange}%`);
  } else if (loadChange > 15) {
    warnings.push(`Load spiked +${loadChange}% (risky)`);
  } else if (loadChange < -20) {
    warnings.push(`Load dropped ${loadChange}%`);
  } else if (loadChange >= -5 && loadChange < 5) {
    reasons.push('Load maintained steady');
  } else if (loadChange < -5 && loadChange >= -20) {
    reasons.push(`Load reduced ${Math.abs(loadChange)}% (recovery week?)`);
  }

  // Analyze consistency
  if (lastWeekDays >= 5) {
    reasons.push(`Consistent across ${lastWeekDays} days`);
  } else if (lastWeekDays >= 3) {
    reasons.push(`Training on ${lastWeekDays} days`);
  } else if (lastWeekDays > 0) {
    warnings.push(`Only ${lastWeekDays} training day${lastWeekDays > 1 ? 's' : ''}`);
  }

  // Analyze hard day distribution
  if (backToBackHard) {
    warnings.push('Two hard days back-to-back');
  } else if (hardDays.length >= 2 && hardDays.length <= 3) {
    reasons.push(`${hardDays.length} quality sessions well-spaced`);
  }

  // Determine verdict
  if (lastWeekSessions === 0 || lastWeekTSS === 0) {
    verdict = 'underloaded';
    emoji = '⚪';
    suggestion = 'Get back on track with a moderate week';
  } else if (warnings.length >= 2 || loadChange > 25) {
    verdict = 'risky';
    emoji = '🔴';
    suggestion = 'Pull back next week to recover';
  } else if (warnings.length === 1 && reasons.length >= 1) {
    verdict = 'neutral';
    emoji = '🟡';
    suggestion = 'Address the warning, otherwise solid';
  } else if (reasons.length >= 2 && warnings.length === 0) {
    verdict = 'productive';
    emoji = '🟢';
    if (loadChange >= 5) {
      suggestion = 'Keep volume steady next week';
    } else {
      suggestion = 'Ready for a small progression';
    }
  } else if (loadChange < -10 && warnings.length === 0) {
    verdict = 'recovery';
    emoji = '🔵';
    suggestion = 'Good recovery - ready to build';
  } else {
    verdict = 'neutral';
    emoji = '🟡';
    suggestion = 'Maintain consistency';
  }

  // If very low volume
  if (lastWeekTSS > 0 && lastWeekTSS < avgPreviousTSS * 0.5 && avgPreviousTSS > 100) {
    verdict = 'underloaded';
    emoji = '⚪';
    warnings.push('Significantly below usual volume');
    suggestion = 'Build back gradually next week';
  }

  return {
    verdict,
    emoji,
    label: verdict.charAt(0).toUpperCase() + verdict.slice(1),
    reasons: reasons.slice(0, 3),
    warnings: warnings.slice(0, 2),
    suggestion,
    stats: {
      tss: lastWeekTSS,
      sessions: lastWeekSessions,
      days: lastWeekDays,
      loadChange,
      hardDays: hardDays.length,
    },
    weekRange: {
      start: lastMondayStr,
      end: lastSundayStr,
    },
  };
};

// Combined: Calculate all guardrails
export const calculateAllGuardrails = (workouts, currentCTL = 0, previousCTL = 0, weeklyTarget = null) => {
  const volumeSpike = calculateVolumeSpike(workouts);
  const intensityStacking = detectIntensityStacking(workouts);
  const longRunCreep = detectLongRunCreep(workouts);
  const hardDayClustering = detectHardDayClustering(workouts);
  const monotony = calculateMonotony(workouts);
  const ctlTrend = calculateCTLTrend(currentCTL, previousCTL);
  const consistency = calculateConsistencyStreak(workouts, weeklyTarget);

  const warnings = [];
  const cautions = [];
  const positives = [];

  // Collect warnings
  [volumeSpike, intensityStacking, longRunCreep, hardDayClustering, monotony].forEach(result => {
    if (result.status === 'warning' && result.message) {
      warnings.push(result.message);
    } else if (result.status === 'caution' && result.message) {
      cautions.push(result.message);
    }
  });

  // Collect positives
  if (ctlTrend.direction === 'up') {
    positives.push(ctlTrend.message);
  }
  if (consistency.weeks >= 2) {
    positives.push(consistency.message);
  }
  if (monotony.status === 'ok' && monotony.dominantType) {
    positives.push('Good training variety');
  }

  // Overall status
  let status = 'good';
  if (warnings.length > 0) {
    status = 'warning';
  } else if (cautions.length > 0) {
    status = 'caution';
  }

  // Recommendation for next week
  let recommendation = null;
  if (volumeSpike.recommendation) {
    const current = volumeSpike.currentTSS;
    const recommended = volumeSpike.recommendation;
    recommendation = `Next week target: ~${recommended} TSS (not ${current} TSS)`;
  }

  return {
    status,
    warnings,
    cautions,
    positives,
    recommendation,
    details: {
      volumeSpike,
      intensityStacking,
      longRunCreep,
      hardDayClustering,
      monotony,
      ctlTrend,
      consistency,
    },
  };
};
