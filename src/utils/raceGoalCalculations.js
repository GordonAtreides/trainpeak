// Race goal and TSS ramp calculations

// Training phases
export const PHASES = {
  BUILD: 'build',
  PEAK: 'peak',
  TAPER: 'taper',
  RACE: 'race',
};

// Calculate weeks until race
export const calculateWeeksToRace = (raceDate) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const race = new Date(raceDate);
  race.setHours(0, 0, 0, 0);

  const diffTime = race - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const diffWeeks = Math.ceil(diffDays / 7);

  return {
    days: diffDays,
    weeks: diffWeeks,
    isPast: diffDays < 0,
  };
};

// Get current training phase based on weeks out
export const getTrainingPhase = (weeksOut) => {
  if (weeksOut <= 0) return PHASES.RACE;
  if (weeksOut === 1) return PHASES.RACE;
  if (weeksOut <= 2) return PHASES.TAPER;
  if (weeksOut <= 3) return PHASES.PEAK;
  return PHASES.BUILD;
};

// Get phase display info
export const getPhaseInfo = (phase) => {
  switch (phase) {
    case PHASES.BUILD:
      return {
        label: 'Build',
        description: 'Building fitness - increase volume gradually',
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
      };
    case PHASES.PEAK:
      return {
        label: 'Peak',
        description: 'Peak week - highest training load',
        color: 'text-purple-600',
        bgColor: 'bg-purple-50',
      };
    case PHASES.TAPER:
      return {
        label: 'Taper',
        description: 'Reducing load - building freshness',
        color: 'text-amber-600',
        bgColor: 'bg-amber-50',
      };
    case PHASES.RACE:
      return {
        label: 'Race Week',
        description: 'Race week - stay fresh, minimal training',
        color: 'text-emerald-600',
        bgColor: 'bg-emerald-50',
      };
    default:
      return {
        label: 'Training',
        description: '',
        color: 'text-gray-600',
        bgColor: 'bg-gray-50',
      };
  }
};

// Calculate weekly TSS target based on phase and baseline
export const calculateWeeklyTarget = (baseTSS, weeksOut, totalWeeks) => {
  const phase = getTrainingPhase(weeksOut);

  // Calculate progression factor (how far into build phase)
  const buildWeeks = Math.max(totalWeeks - 3, 1);
  const currentBuildWeek = totalWeeks - weeksOut;
  const progressionFactor = Math.min(currentBuildWeek / buildWeeks, 1);

  switch (phase) {
    case PHASES.BUILD:
      // Gradual increase: base + up to 30% over build phase
      // Using 6-8% per week compound growth
      const weeklyGrowth = 1.07; // 7% per week
      const buildMultiplier = Math.pow(weeklyGrowth, currentBuildWeek);
      return Math.round(baseTSS * Math.min(buildMultiplier, 1.5)); // Cap at 50% increase

    case PHASES.PEAK:
      // Peak week: highest volume (base * 1.3 to 1.4)
      return Math.round(baseTSS * 1.35);

    case PHASES.TAPER:
      // Taper: 2 weeks out = 80%, 1 week out handled by RACE
      return Math.round(baseTSS * 0.80);

    case PHASES.RACE:
      // Race week: 40-50% of base
      return Math.round(baseTSS * 0.45);

    default:
      return baseTSS;
  }
};

// Generate full TSS ramp plan
export const generateTSSRamp = (baseTSS, raceDate) => {
  const { weeks: totalWeeks, isPast } = calculateWeeksToRace(raceDate);

  if (isPast || totalWeeks <= 0) {
    return { weeks: [], totalWeeks: 0, isPast: true };
  }

  const plan = [];

  for (let w = totalWeeks; w >= 1; w--) {
    const phase = getTrainingPhase(w);
    const target = calculateWeeklyTarget(baseTSS, w, totalWeeks);
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() + ((totalWeeks - w) * 7));

    plan.push({
      weeksOut: w,
      weekNumber: totalWeeks - w + 1,
      phase,
      phaseInfo: getPhaseInfo(phase),
      targetTSS: target,
      weekStart: weekStart.toISOString().split('T')[0],
    });
  }

  return {
    weeks: plan,
    totalWeeks,
    isPast: false,
    peakWeek: plan.find(w => w.phase === PHASES.PEAK),
    taperStart: plan.find(w => w.phase === PHASES.TAPER),
  };
};

// Get current week's target from a race goal
export const getCurrentWeekTarget = (raceGoal, baseTSS) => {
  if (!raceGoal?.raceDate) return null;

  const { weeks: weeksOut, isPast } = calculateWeeksToRace(raceGoal.raceDate);

  if (isPast) return null;

  const totalWeeks = raceGoal.totalWeeks || weeksOut;
  const phase = getTrainingPhase(weeksOut);
  const target = calculateWeeklyTarget(baseTSS, weeksOut, totalWeeks);

  return {
    weeksOut,
    phase,
    phaseInfo: getPhaseInfo(phase),
    targetTSS: target,
    raceName: raceGoal.raceName,
    raceDate: raceGoal.raceDate,
  };
};

// Calculate projected CTL on race day
export const calculateProjectedCTL = (currentCTL, weeklyTargets) => {
  let projectedCTL = currentCTL;

  // Simulate daily TSS application (simplified: assume even distribution)
  weeklyTargets.forEach(week => {
    const dailyTSS = week.targetTSS / 7;
    for (let d = 0; d < 7; d++) {
      // CTL formula: previousCTL + (todayTSS - previousCTL) / 42
      projectedCTL = projectedCTL + (dailyTSS - projectedCTL) / 42;
    }
  });

  return Math.round(projectedCTL * 10) / 10;
};

// Format race countdown
export const formatRaceCountdown = (raceDate, raceName) => {
  const { days, weeks, isPast } = calculateWeeksToRace(raceDate);

  if (isPast) {
    return { text: `${raceName} completed`, isPast: true };
  }

  if (days === 0) {
    return { text: `${raceName} is TODAY!`, isPast: false, isRaceDay: true };
  }

  if (days <= 7) {
    return { text: `${raceName} in ${days} days`, isPast: false };
  }

  return { text: `${raceName} in ${weeks} weeks`, isPast: false };
};
