// 12-Week Half Ironman (70.3) Training Plan - Custom for Ben
// Race Day: May 17, 2026 | Target: Sub-6 Hours
// Strong swimmer, building the run
// BUILD 1 (Wk 1-4) > BUILD 2 (Wk 5-8) > PEAK (Wk 9-10) > TAPER (Wk 11-12)

export const ben703Plan = {
  name: "12-Week 70.3 Plan (Sub-6 Target)",
  description: "Custom plan for Ben: Strong swim base, focus on run development. Target sub-6 hours.",
  totalWeeks: 12,
  weeks: [
    // WEEK 1 - BUILD 1 (~7.5 hrs)
    {
      week: 1,
      phase: "Build 1",
      days: [
        { day: 0, type: 'bike', name: 'Long Ride', description: '60km long ride - RPE 5-6. KEY SESSION', duration: 120, tss: 90 },
        { day: 1, type: 'run', name: 'Easy Run', description: '30min easy (RPE 4) - focus on form', duration: 30, tss: 25 },
        { day: 2, type: 'swim', name: 'Threshold Swim', description: '10x100m at 1:40/100m, 20s rest. KEY SESSION', duration: 45, tss: 40 },
        { day: 3, type: 'bike', name: 'Tempo Bike', description: '60min with 3x5min tempo (RPE 7)', duration: 60, tss: 55 },
        { day: 4, type: 'run', name: 'Tempo Intervals', description: '35min with 4x2min tempo (RPE 7), 2min easy between. KEY SESSION', duration: 35, tss: 40 },
        { day: 5, type: 'swim', name: 'Easy Endurance Swim', description: '1500m continuous easy', duration: 30, tss: 25 },
        { day: 6, type: 'brick', name: 'Brick Intro', description: '45min easy spin + 15min run off bike. First brick!', duration: 60, tss: 45 },
      ]
    },
    // WEEK 2 - BUILD 1 (~8 hrs)
    {
      week: 2,
      phase: "Build 1",
      days: [
        { day: 0, type: 'bike', name: 'Long Ride', description: '65km long ride with 20min race pace. KEY SESSION', duration: 130, tss: 100 },
        { day: 1, type: 'run', name: 'Easy Run', description: '35min easy', duration: 35, tss: 28 },
        { day: 2, type: 'swim', name: 'Speed Swim', description: '8x75m fast, 30s rest. Keep top-end sharp. KEY SESSION', duration: 45, tss: 42 },
        { day: 3, type: 'bike', name: 'Sweet Spot Bike', description: '70min sweet spot (RPE 6-7)', duration: 70, tss: 60 },
        { day: 4, type: 'run', name: 'Tempo Run', description: '40min with 5x3min tempo (RPE 7). KEY SESSION', duration: 40, tss: 45 },
        { day: 5, type: 'swim', name: 'Pull Set', description: '30min easy with paddles + buoy', duration: 30, tss: 25 },
        { day: 6, type: 'brick', name: 'Brick Run', description: '45min easy spin + 20min off bike (RPE 5-6). KEY SESSION', duration: 65, tss: 50 },
      ]
    },
    // WEEK 3 - BUILD 1 (~9 hrs)
    {
      week: 3,
      phase: "Build 1",
      days: [
        { day: 0, type: 'bike', name: 'Long Ride', description: '70km long ride - RPE 5-6. KEY SESSION', duration: 140, tss: 105 },
        { day: 1, type: 'run', name: 'Easy Run', description: '35min easy', duration: 35, tss: 28 },
        { day: 2, type: 'swim', name: 'Race Pace Swim', description: '4x400m at 1:45/100m. Dial in the effort. KEY SESSION', duration: 45, tss: 45 },
        { day: 3, type: 'bike', name: 'Race Pace Bike', description: '75min with 2x15min race pace (RPE 7)', duration: 75, tss: 65 },
        { day: 4, type: 'run', name: 'Extended Tempo', description: '45min with 3x6min tempo (RPE 7). 18min total at tempo. KEY SESSION', duration: 45, tss: 50 },
        { day: 5, type: 'swim', name: 'Technique + Speed', description: 'Drills + 6x50m sprint', duration: 30, tss: 28 },
        { day: 6, type: 'brick', name: 'Brick Session', description: '50min easy spin + 25min off bike', duration: 75, tss: 55 },
      ]
    },
    // WEEK 4 - BUILD 1 RECOVERY (~6 hrs)
    {
      week: 4,
      phase: "Build 1 (Recovery)",
      days: [
        { day: 0, type: 'bike', name: 'Easy Ride', description: '50km easy ride. Recovery rides only', duration: 100, tss: 65 },
        { day: 1, type: 'run', name: 'Easy Run', description: '25min easy recovery', duration: 25, tss: 20 },
        { day: 2, type: 'swim', name: '1000m TT', description: 'BENCHMARK: 1000m time trial. Target <17:00. KEY SESSION', duration: 30, tss: 35 },
        { day: 3, type: 'bike', name: 'Easy Spin', description: '45min easy recovery spin', duration: 45, tss: 30 },
        { day: 4, type: 'run', name: '5km TT', description: 'BENCHMARK: 5km time trial. Target sub-26:00. KEY SESSION', duration: 30, tss: 40 },
        { day: 5, type: 'swim', name: 'Easy Swim', description: '30min easy 1500m + drills', duration: 30, tss: 22 },
        { day: 6, type: 'run', name: 'Easy Recovery', description: '20min easy recovery jog', duration: 20, tss: 15 },
      ]
    },
    // WEEK 5 - BUILD 2 (~9.5 hrs)
    {
      week: 5,
      phase: "Build 2",
      days: [
        { day: 0, type: 'bike', name: 'Long Ride', description: '75km long ride. KEY SESSION', duration: 150, tss: 112 },
        { day: 1, type: 'run', name: 'Easy Run', description: '40min easy', duration: 40, tss: 32 },
        { day: 2, type: 'swim', name: 'Threshold Swim', description: '12x100m at 1:35/100m. Push threshold pace down. KEY SESSION', duration: 50, tss: 48 },
        { day: 3, type: 'bike', name: 'Race Pace Bike', description: '80min with 3x12min race pace', duration: 80, tss: 72 },
        { day: 4, type: 'run', name: 'Sustained Tempo', description: '50min with 2x10min tempo (RPE 7). KEY SESSION', duration: 50, tss: 55 },
        { day: 5, type: 'swim', name: 'Open Water Skills', description: '35min open water skills or pull set', duration: 35, tss: 28 },
        { day: 6, type: 'brick', name: 'Brick Session', description: '50min easy + 30min off bike (RPE 6). KEY SESSION', duration: 80, tss: 62 },
      ]
    },
    // WEEK 6 - BUILD 2 (~10 hrs)
    {
      week: 6,
      phase: "Build 2",
      days: [
        { day: 0, type: 'bike', name: 'Long Ride', description: '80km long ride. KEY SESSION', duration: 160, tss: 120 },
        { day: 1, type: 'run', name: 'Easy Run', description: '40min easy', duration: 40, tss: 32 },
        { day: 2, type: 'swim', name: 'Race Sim Swim', description: '1900m at race pace - should feel easy. KEY SESSION', duration: 50, tss: 45 },
        { day: 3, type: 'bike', name: 'Sustained Effort', description: '80min with 20min sustained race pace', duration: 80, tss: 72 },
        { day: 4, type: 'run', name: 'Continuous Tempo', description: '55min with 20min continuous tempo (RPE 7). Big milestone! KEY SESSION', duration: 55, tss: 60 },
        { day: 5, type: 'swim', name: 'Speed Work', description: '35min with 10x50m sprint', duration: 35, tss: 32 },
        { day: 6, type: 'brick', name: 'Brick Session', description: '50min easy + 30min off bike (RPE 6-7). KEY SESSION', duration: 80, tss: 65 },
      ]
    },
    // WEEK 7 - BUILD 2 (~10 hrs)
    {
      week: 7,
      phase: "Build 2",
      days: [
        { day: 0, type: 'bike', name: 'Long Ride + Nutrition', description: '85km long ride + NUTRITION PRACTICE. Critical! KEY SESSION', duration: 170, tss: 130 },
        { day: 1, type: 'run', name: 'Easy Run', description: '40min easy', duration: 40, tss: 32 },
        { day: 2, type: 'swim', name: 'Threshold Swim', description: '6x200m at 1:40/100m. KEY SESSION', duration: 45, tss: 42 },
        { day: 3, type: 'bike', name: 'Race Pace Intervals', description: '85min with race pace intervals', duration: 85, tss: 78 },
        { day: 4, type: 'run', name: 'Extended Tempo', description: '60min with 25min continuous tempo. KEY SESSION', duration: 60, tss: 65 },
        { day: 5, type: 'swim', name: 'Easy/Open Water', description: '30min easy + open water if possible', duration: 30, tss: 25 },
        { day: 6, type: 'brick', name: 'Race Effort Brick', description: '50min easy + 35min at race effort (RPE 7). KEY SESSION', duration: 85, tss: 72 },
      ]
    },
    // WEEK 8 - BUILD 2 RECOVERY (~6.5 hrs)
    {
      week: 8,
      phase: "Build 2 (Recovery)",
      days: [
        { day: 0, type: 'bike', name: 'FTP Test', description: '60km with 20min FTP test effort. BENCHMARK. KEY SESSION', duration: 120, tss: 85 },
        { day: 1, type: 'run', name: 'Easy Run', description: '30min easy recovery', duration: 30, tss: 24 },
        { day: 2, type: 'swim', name: '1000m TT Retest', description: 'BENCHMARK: 1000m TT retest. Compare to week 4. KEY SESSION', duration: 30, tss: 35 },
        { day: 3, type: 'bike', name: 'Easy Spin', description: '45min easy recovery spin', duration: 45, tss: 30 },
        { day: 4, type: 'run', name: '10km TT', description: 'BENCHMARK: 10km time trial. Target sub-55:00. KEY SESSION', duration: 55, tss: 65 },
        { day: 5, type: 'swim', name: 'Easy Swim', description: '30min easy 1500m', duration: 30, tss: 22 },
        { day: 6, type: 'run', name: 'Easy Recovery', description: '20min easy recovery jog', duration: 20, tss: 15 },
      ]
    },
    // WEEK 9 - PEAK (~10 hrs) - THE BIG WEEK
    {
      week: 9,
      phase: "Peak",
      days: [
        { day: 0, type: 'bike', name: 'Longest Ride', description: '90km long ride - NON-NEGOTIABLE. Biggest ride of plan. KEY SESSION', duration: 180, tss: 140 },
        { day: 1, type: 'run', name: 'Easy Run', description: '40min easy', duration: 40, tss: 32 },
        { day: 2, type: 'swim', name: 'Race Pace Swim', description: '1900m continuous at race effort - routine by now. KEY SESSION', duration: 45, tss: 42 },
        { day: 3, type: 'bike', name: 'Race Simulation', description: '90min race simulation', duration: 90, tss: 82 },
        { day: 4, type: 'run', name: 'Longest Run', description: '70min long run with 30min at race pace (5:27/km). NON-NEGOTIABLE. KEY SESSION', duration: 70, tss: 75 },
        { day: 5, type: 'swim', name: 'Speed Maintenance', description: '35min with 8x75m fast', duration: 35, tss: 32 },
        { day: 6, type: 'brick', name: 'Full Race Intensity', description: '50min easy + 35min at full race intensity. KEY SESSION', duration: 85, tss: 75 },
      ]
    },
    // WEEK 10 - PEAK (~9.5 hrs)
    {
      week: 10,
      phase: "Peak",
      days: [
        { day: 0, type: 'bike', name: 'Nutrition Dress Rehearsal', description: '80km with FULL RACE NUTRITION. Final test. KEY SESSION', duration: 160, tss: 125 },
        { day: 1, type: 'run', name: 'Easy Run', description: '40min easy', duration: 40, tss: 32 },
        { day: 2, type: 'swim', name: 'Race Sim + Mass Start', description: '45min race sim with mass start practice. KEY SESSION', duration: 45, tss: 42 },
        { day: 3, type: 'bike', name: 'Race Pace', description: '80min with 30min race pace', duration: 80, tss: 72 },
        { day: 4, type: 'run', name: 'Race Pace Run', description: '55min with 20min at race pace. KEY SESSION', duration: 55, tss: 58 },
        { day: 5, type: 'swim', name: 'Easy Maintenance', description: '30min easy maintenance', duration: 30, tss: 24 },
        { day: 6, type: 'brick', name: 'Brick Benchmark', description: '60min bike + 30min run at race effort. Can you hold 5:30/km? THE TEST. KEY SESSION', duration: 90, tss: 80 },
      ]
    },
    // WEEK 11 - TAPER (~6 hrs)
    {
      week: 11,
      phase: "Taper",
      days: [
        { day: 0, type: 'bike', name: 'Short Sharp Efforts', description: '60min with 2x10min race pace', duration: 60, tss: 52 },
        { day: 1, type: 'run', name: 'Easy Run', description: '30min easy', duration: 30, tss: 24 },
        { day: 2, type: 'swim', name: 'Stay Sharp', description: '35min with 4x100m race pace. KEY SESSION', duration: 35, tss: 32 },
        { day: 3, type: 'bike', name: 'Easy Spin', description: '40min easy spinning', duration: 40, tss: 28 },
        { day: 4, type: 'run', name: 'Race Pace Touches', description: '40min with 3x5min race pace. KEY SESSION', duration: 40, tss: 42 },
        { day: 5, type: 'swim', name: 'Easy Cruise', description: '20min easy cruise', duration: 20, tss: 15 },
        { day: 6, type: 'run', name: 'Easy Run', description: '20min easy', duration: 20, tss: 16 },
      ]
    },
    // WEEK 12 - RACE WEEK (~3 hrs)
    {
      week: 12,
      phase: "Race Week",
      days: [
        { day: 0, type: 'bike', name: 'Easy Spin + Openers', description: '30min easy + 3x1min race pace', duration: 30, tss: 25 },
        { day: 1, type: 'swim', name: 'Easy + Strides', description: '20min easy + 4x50m strides. Stay loose.', duration: 20, tss: 18 },
        { day: 2, type: 'run', name: 'Light Strides', description: '20min easy jog + 4x30sec strides', duration: 20, tss: 18 },
        { day: 3, type: 'swim', name: 'Feel the Water', description: '15min easy - feel the water', duration: 15, tss: 12 },
        { day: 4, type: 'bike', name: 'Thursday Openers', description: '20min easy spin (openers). KEY SESSION', duration: 20, tss: 15 },
        { day: 5, type: 'rest', name: 'Rest - Race Prep', description: 'Complete rest. Prep gear. Visualise. You are ready.', duration: 0, tss: 0 },
        { day: 6, type: 'race', name: 'RACE DAY', description: '70.3 Half Ironman - 1.9km swim, 90km bike, 21.1km run. Target: Sub-6!', duration: 343, tss: 300 },
      ]
    },
  ]
};

// Helper to generate workouts from plan based on race date
export const generateWorkoutsFromBenPlan = (plan, raceDate) => {
  const workouts = [];
  const raceDateObj = new Date(raceDate);

  // Calculate start date (12 weeks before race, starting on Sunday)
  const startDate = new Date(raceDateObj);
  startDate.setDate(startDate.getDate() - (plan.totalWeeks * 7) + 1);

  // Adjust to Sunday (day 0 of week)
  const dayOfWeek = startDate.getDay();
  startDate.setDate(startDate.getDate() - dayOfWeek);

  plan.weeks.forEach((week) => {
    week.days.forEach((day) => {
      const workoutDate = new Date(startDate);
      workoutDate.setDate(workoutDate.getDate() + ((week.week - 1) * 7) + day.day);

      const dateStr = workoutDate.toISOString().split('T')[0];

      workouts.push({
        id: `ben-plan-w${week.week}-d${day.day}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        date: dateStr,
        planned: {
          type: day.type,
          name: day.name,
          description: `Week ${week.week} (${week.phase}) - ${day.description}`,
          duration: day.duration,
          tss: day.tss,
        },
        completed: null,
        source: 'plan',
        planWeek: week.week,
        planPhase: week.phase,
      });
    });
  });

  return workouts;
};
