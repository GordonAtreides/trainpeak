// TSS calculation utilities

// TSS estimation multipliers by effort level
const EFFORT_MULTIPLIERS = {
  easy: 0.5,
  moderate: 0.75,
  hard: 1.0,
  strength: 0.6,
};

// Estimate TSS from duration and effort
export const estimateTSS = (duration, effort = 'moderate') => {
  const multiplier = EFFORT_MULTIPLIERS[effort] || 0.75;
  return Math.round(duration * multiplier);
};

// Calculate CTL (Chronic Training Load) - 42-day exponential average
export const calculateCTL = (previousCTL, todayTSS) => {
  return previousCTL + (todayTSS - previousCTL) / 42;
};

// Calculate ATL (Acute Training Load) - 7-day exponential average
export const calculateATL = (previousATL, todayTSS) => {
  return previousATL + (todayTSS - previousATL) / 7;
};

// Calculate TSB (Training Stress Balance) - Form
export const calculateTSB = (ctl, atl) => {
  return ctl - atl;
};

// Calculate all metrics from workout history
export const calculateMetrics = (workouts, targetDate = null) => {
  const today = targetDate || new Date().toISOString().split('T')[0];

  // Sort workouts by date
  const sortedWorkouts = [...workouts].sort((a, b) =>
    new Date(a.date) - new Date(b.date)
  );

  // Build a map of TSS by date
  const tssByDate = {};
  sortedWorkouts.forEach(workout => {
    const tss = workout.completed?.tss || 0;
    tssByDate[workout.date] = (tssByDate[workout.date] || 0) + tss;
  });

  // Start from 90 days ago
  let ctl = 0;
  let atl = 0;

  const startDate = new Date(today);
  startDate.setDate(startDate.getDate() - 90);

  const currentDate = new Date(startDate);
  const endDate = new Date(today);

  while (currentDate <= endDate) {
    const dateStr = currentDate.toISOString().split('T')[0];
    const dayTSS = tssByDate[dateStr] || 0;

    ctl = calculateCTL(ctl, dayTSS);
    atl = calculateATL(atl, dayTSS);

    currentDate.setDate(currentDate.getDate() + 1);
  }

  const tsb = calculateTSB(ctl, atl);

  return {
    ctl: Math.round(ctl * 10) / 10,
    atl: Math.round(atl * 10) / 10,
    tsb: Math.round(tsb * 10) / 10,
  };
};

// Calculate weekly TSS totals
export const calculateWeeklyTSS = (workouts, weekDates) => {
  let planned = 0;
  let completed = 0;

  workouts.forEach(workout => {
    if (weekDates.includes(workout.date)) {
      if (workout.planned?.tss) {
        planned += workout.planned.tss;
      }
      if (workout.completed?.tss) {
        completed += workout.completed.tss;
      }
    }
  });

  return { planned, completed };
};

// Get form status description
export const getFormStatus = (tsb) => {
  if (tsb > 25) return { label: 'Fresh', color: 'text-emerald-600' };
  if (tsb > 5) return { label: 'Rested', color: 'text-emerald-500' };
  if (tsb > -10) return { label: 'Neutral', color: 'text-gray-600' };
  if (tsb > -25) return { label: 'Tired', color: 'text-amber-600' };
  return { label: 'Very Tired', color: 'text-red-600' };
};

// Calculate historical metrics for charting (day by day)
export const calculateHistoricalMetrics = (workouts, days = 90) => {
  const today = new Date();
  const history = [];

  // Sort workouts by date
  const sortedWorkouts = [...workouts].sort((a, b) =>
    new Date(a.date) - new Date(b.date)
  );

  // Build a map of TSS by date
  const tssByDate = {};
  sortedWorkouts.forEach(workout => {
    const tss = workout.completed?.tss || 0;
    tssByDate[workout.date] = (tssByDate[workout.date] || 0) + tss;
  });

  // Start from (days + 42) days ago to warm up the CTL calculation
  let ctl = 0;
  let atl = 0;

  const warmupStart = new Date(today);
  warmupStart.setDate(warmupStart.getDate() - days - 42);

  const chartStart = new Date(today);
  chartStart.setDate(chartStart.getDate() - days);

  const currentDate = new Date(warmupStart);

  while (currentDate <= today) {
    const dateStr = currentDate.toISOString().split('T')[0];
    const dayTSS = tssByDate[dateStr] || 0;

    ctl = calculateCTL(ctl, dayTSS);
    atl = calculateATL(atl, dayTSS);

    // Only add to history after warmup period
    if (currentDate >= chartStart) {
      history.push({
        date: dateStr,
        ctl: Math.round(ctl * 10) / 10,
        atl: Math.round(atl * 10) / 10,
        tsb: Math.round((ctl - atl) * 10) / 10,
        tss: dayTSS,
      });
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return history;
};

// Calculate weekly volume data for charting
export const calculateWeeklyVolume = (workouts, weeks = 12) => {
  const today = new Date();
  const weeklyData = [];

  // Go back 'weeks' weeks
  for (let w = weeks - 1; w >= 0; w--) {
    const weekEnd = new Date(today);
    weekEnd.setDate(weekEnd.getDate() - (w * 7));

    const weekStart = new Date(weekEnd);
    weekStart.setDate(weekStart.getDate() - 6);

    const weekStartStr = weekStart.toISOString().split('T')[0];
    const weekEndStr = weekEnd.toISOString().split('T')[0];

    // Aggregate by activity type
    const weekData = {
      week: weekStartStr,
      weekLabel: `${weekStart.getMonth() + 1}/${weekStart.getDate()}`,
      totalTSS: 0,
      totalDuration: 0,
      run: 0,
      bike: 0,
      swim: 0,
      strength: 0,
    };

    workouts.forEach(workout => {
      if (workout.date >= weekStartStr && workout.date <= weekEndStr && workout.completed) {
        const tss = workout.completed.tss || 0;
        const duration = workout.completed.duration || 0;
        const type = workout.planned?.type || 'run';

        weekData.totalTSS += tss;
        weekData.totalDuration += duration;

        if (type in weekData) {
          weekData[type] += tss;
        }
      }
    });

    weeklyData.push(weekData);
  }

  return weeklyData;
};
