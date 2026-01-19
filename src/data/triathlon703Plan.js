// 18-Week Half Ironman (70.3) Training Plan
// WEEKS 1-6: Base & Durability
// WEEKS 7-12: Build & Specificity
// WEEKS 13-16: Peak & Race Prep
// WEEKS 17-18: Taper

export const triathlon703Plan = {
  name: "18-Week 70.3 Training Plan",
  description: "Complete Half Ironman training plan: Base → Build → Peak → Taper",
  totalWeeks: 18,
  weeks: [
    // WEEK 1 - Base (~7 hrs)
    {
      week: 1,
      phase: "Base",
      days: [
        { day: 0, type: 'rest', name: 'Rest / Mobility', description: 'Active recovery, mobility work', duration: 0, tss: 0 },
        { day: 1, type: 'run', name: 'Easy Run', description: '6 km easy pace', duration: 36, tss: 30 },
        { day: 2, type: 'bike', name: 'Endurance Bike', description: '60 min Z2', duration: 60, tss: 45 },
        { day: 3, type: 'run', name: 'Easy Run + Strides', description: '6 km easy + 4 strides', duration: 40, tss: 35 },
        { day: 4, type: 'swim', name: 'Swim Steady', description: '45 min steady swimming', duration: 45, tss: 35 },
        { day: 5, type: 'bike', name: 'Long Bike', description: '55 km easy', duration: 105, tss: 75 },
        { day: 6, type: 'run', name: 'Long Run', description: '8 km easy', duration: 50, tss: 45 },
      ]
    },
    // WEEK 2 - Base (~7.5 hrs)
    {
      week: 2,
      phase: "Base",
      days: [
        { day: 0, type: 'rest', name: 'Rest / Mobility', description: 'Active recovery, mobility work', duration: 0, tss: 0 },
        { day: 1, type: 'run', name: 'Easy Run', description: '7 km easy pace', duration: 42, tss: 35 },
        { day: 2, type: 'bike', name: 'Endurance Bike', description: '70 min Z2', duration: 70, tss: 52 },
        { day: 3, type: 'run', name: 'Easy Run + Strides', description: '6 km + 5 strides', duration: 40, tss: 38 },
        { day: 4, type: 'swim', name: 'Swim Steady', description: '45-50 min swimming', duration: 48, tss: 38 },
        { day: 5, type: 'bike', name: 'Long Bike', description: '60 km easy', duration: 115, tss: 82 },
        { day: 6, type: 'run', name: 'Long Run', description: '9 km easy', duration: 55, tss: 50 },
      ]
    },
    // WEEK 3 - Base (~8 hrs)
    {
      week: 3,
      phase: "Base",
      days: [
        { day: 0, type: 'rest', name: 'Rest / Mobility', description: 'Active recovery, mobility work', duration: 0, tss: 0 },
        { day: 1, type: 'run', name: 'Easy Run', description: '8 km easy', duration: 48, tss: 40 },
        { day: 2, type: 'bike', name: 'Endurance Bike + Brick', description: '75 min + optional 10 min brick jog', duration: 85, tss: 65 },
        { day: 3, type: 'run', name: 'Easy Run + Strides', description: '7 km + strides', duration: 45, tss: 42 },
        { day: 4, type: 'swim', name: 'Swim Steady', description: '50 min swimming', duration: 50, tss: 40 },
        { day: 5, type: 'bike', name: 'Long Bike', description: '65 km easy', duration: 125, tss: 90 },
        { day: 6, type: 'run', name: 'Long Run', description: '10 km easy', duration: 60, tss: 55 },
      ]
    },
    // WEEK 4 - Base Down Week (~6.5 hrs)
    {
      week: 4,
      phase: "Base (Recovery)",
      days: [
        { day: 0, type: 'rest', name: 'Rest / Mobility', description: 'Active recovery', duration: 0, tss: 0 },
        { day: 1, type: 'run', name: 'Easy Run', description: '6 km recovery pace', duration: 36, tss: 28 },
        { day: 2, type: 'bike', name: 'Endurance Bike', description: '60 min Z2', duration: 60, tss: 42 },
        { day: 3, type: 'run', name: 'Easy Run', description: '6 km easy', duration: 36, tss: 28 },
        { day: 4, type: 'swim', name: 'Swim Easy', description: '40-45 min swimming', duration: 42, tss: 32 },
        { day: 5, type: 'bike', name: 'Long Bike', description: '55 km easy', duration: 105, tss: 70 },
        { day: 6, type: 'run', name: 'Long Run', description: '8 km easy', duration: 48, tss: 42 },
      ]
    },
    // WEEK 5 - Base (~8.5 hrs)
    {
      week: 5,
      phase: "Base",
      days: [
        { day: 0, type: 'rest', name: 'Rest / Mobility', description: 'Active recovery', duration: 0, tss: 0 },
        { day: 1, type: 'run', name: 'Easy Run', description: '8 km easy', duration: 48, tss: 40 },
        { day: 2, type: 'bike', name: 'Endurance Bike + Brick', description: '80 min + 10 min brick jog', duration: 90, tss: 70 },
        { day: 3, type: 'run', name: 'Easy Run + Strides', description: '7 km + strides', duration: 45, tss: 42 },
        { day: 4, type: 'swim', name: 'Swim Steady', description: '50-55 min swimming', duration: 52, tss: 42 },
        { day: 5, type: 'bike', name: 'Long Bike', description: '70 km', duration: 135, tss: 98 },
        { day: 6, type: 'run', name: 'Long Run', description: '11 km easy', duration: 66, tss: 60 },
      ]
    },
    // WEEK 6 - Base (~9 hrs)
    {
      week: 6,
      phase: "Base",
      days: [
        { day: 0, type: 'rest', name: 'Rest / Mobility', description: 'Active recovery', duration: 0, tss: 0 },
        { day: 1, type: 'run', name: 'Easy Run', description: '9 km easy', duration: 54, tss: 45 },
        { day: 2, type: 'bike', name: 'Endurance Bike', description: '90 min Z2', duration: 90, tss: 68 },
        { day: 3, type: 'run', name: 'Easy Run + Strides', description: '7 km + strides', duration: 45, tss: 42 },
        { day: 4, type: 'swim', name: 'Swim Endurance', description: '60 min swimming', duration: 60, tss: 48 },
        { day: 5, type: 'bike', name: 'Long Bike', description: '80 km', duration: 150, tss: 110 },
        { day: 6, type: 'run', name: 'Long Run', description: '12 km easy', duration: 72, tss: 65 },
      ]
    },
    // WEEK 7 - Build
    {
      week: 7,
      phase: "Build",
      days: [
        { day: 0, type: 'rest', name: 'Rest / Mobility', description: 'Active recovery', duration: 0, tss: 0 },
        { day: 1, type: 'run', name: 'Tempo Run', description: '2×10 min steady (HM effort)', duration: 45, tss: 55 },
        { day: 2, type: 'bike', name: 'Tempo Bike', description: '75 min with 2×15 min tempo', duration: 75, tss: 70 },
        { day: 3, type: 'run', name: 'Easy Run', description: '8 km easy', duration: 48, tss: 40 },
        { day: 4, type: 'swim', name: 'Swim Endurance', description: '60 min swimming', duration: 60, tss: 48 },
        { day: 5, type: 'bike', name: 'Long Bike + Brick', description: '85 km + 15 min brick run', duration: 175, tss: 130 },
        { day: 6, type: 'run', name: 'Long Run', description: '13 km', duration: 78, tss: 70 },
      ]
    },
    // WEEK 8 - Build
    {
      week: 8,
      phase: "Build",
      days: [
        { day: 0, type: 'rest', name: 'Rest / Mobility', description: 'Active recovery', duration: 0, tss: 0 },
        { day: 1, type: 'run', name: 'Tempo Run', description: '3×8 min steady', duration: 50, tss: 58 },
        { day: 2, type: 'bike', name: 'Endurance Bike', description: '90 min Z2', duration: 90, tss: 68 },
        { day: 3, type: 'run', name: 'Easy Run + Strides', description: '8 km + strides', duration: 50, tss: 45 },
        { day: 4, type: 'swim', name: 'Swim', description: '55-60 min swimming', duration: 58, tss: 46 },
        { day: 5, type: 'bike', name: 'Long Bike + Brick', description: '90 km + 20 min brick run', duration: 190, tss: 145 },
        { day: 6, type: 'run', name: 'Long Run', description: '14 km', duration: 84, tss: 75 },
      ]
    },
    // WEEK 9 - Build Down Week
    {
      week: 9,
      phase: "Build (Recovery)",
      days: [
        { day: 0, type: 'rest', name: 'Rest / Mobility', description: 'Recovery week - reduce volume 20%', duration: 0, tss: 0 },
        { day: 1, type: 'run', name: 'Easy Run', description: '6 km recovery', duration: 36, tss: 28 },
        { day: 2, type: 'bike', name: 'Easy Bike', description: '60 min easy', duration: 60, tss: 42 },
        { day: 3, type: 'run', name: 'Easy Run', description: '6 km easy', duration: 36, tss: 28 },
        { day: 4, type: 'swim', name: 'Swim Easy', description: '45 min easy', duration: 45, tss: 35 },
        { day: 5, type: 'bike', name: 'Long Bike', description: '70 km easy', duration: 135, tss: 95 },
        { day: 6, type: 'run', name: 'Long Run', description: '11-12 km easy', duration: 70, tss: 60 },
      ]
    },
    // WEEK 10 - Build
    {
      week: 10,
      phase: "Build",
      days: [
        { day: 0, type: 'rest', name: 'Rest / Mobility', description: 'Active recovery', duration: 0, tss: 0 },
        { day: 1, type: 'run', name: 'Tempo Run', description: '3×10 min steady', duration: 55, tss: 65 },
        { day: 2, type: 'bike', name: 'Tempo Bike', description: '90 min with 2×20 min HIM effort', duration: 90, tss: 85 },
        { day: 3, type: 'run', name: 'Easy Run', description: '9 km easy', duration: 54, tss: 45 },
        { day: 4, type: 'swim', name: 'Swim', description: '60 min swimming', duration: 60, tss: 48 },
        { day: 5, type: 'bike', name: 'Long Bike + Brick', description: '100 km + 25 min brick run', duration: 215, tss: 165 },
        { day: 6, type: 'run', name: 'Long Run', description: '15 km', duration: 90, tss: 80 },
      ]
    },
    // WEEK 11 - Build
    {
      week: 11,
      phase: "Build",
      days: [
        { day: 0, type: 'rest', name: 'Rest / Mobility', description: 'Active recovery', duration: 0, tss: 0 },
        { day: 1, type: 'run', name: 'Tempo Run', description: '4×8 min steady', duration: 55, tss: 65 },
        { day: 2, type: 'bike', name: 'Endurance Bike', description: '100 min', duration: 100, tss: 75 },
        { day: 3, type: 'run', name: 'Easy Run', description: '9 km easy', duration: 54, tss: 45 },
        { day: 4, type: 'swim', name: 'Swim', description: '60 min swimming', duration: 60, tss: 48 },
        { day: 5, type: 'bike', name: 'Long Bike + Brick', description: '110 km + 30 min brick run', duration: 240, tss: 185 },
        { day: 6, type: 'run', name: 'Long Run', description: '16 km', duration: 96, tss: 85 },
      ]
    },
    // WEEK 12 - Build
    {
      week: 12,
      phase: "Build",
      days: [
        { day: 0, type: 'rest', name: 'Rest / Mobility', description: 'Active recovery', duration: 0, tss: 0 },
        { day: 1, type: 'run', name: 'Tempo Run', description: '30 min steady continuous', duration: 50, tss: 60 },
        { day: 2, type: 'bike', name: 'Endurance Bike', description: '90 min', duration: 90, tss: 68 },
        { day: 3, type: 'run', name: 'Easy Run', description: '8 km easy', duration: 48, tss: 40 },
        { day: 4, type: 'swim', name: 'Swim', description: '60 min swimming', duration: 60, tss: 48 },
        { day: 5, type: 'bike', name: 'Long Bike + Brick', description: '120 km + 30 min brick run', duration: 260, tss: 200 },
        { day: 6, type: 'run', name: 'Long Run', description: '17 km', duration: 102, tss: 92 },
      ]
    },
    // WEEK 13 - Peak
    {
      week: 13,
      phase: "Peak",
      days: [
        { day: 0, type: 'rest', name: 'Rest / Mobility', description: 'Active recovery', duration: 0, tss: 0 },
        { day: 1, type: 'run', name: 'Easy Run', description: '7 km easy', duration: 42, tss: 35 },
        { day: 2, type: 'bike', name: 'Tempo Bike', description: '75 min with tempo efforts', duration: 75, tss: 70 },
        { day: 3, type: 'run', name: 'Easy Run + Strides', description: '7 km + strides', duration: 45, tss: 42 },
        { day: 4, type: 'swim', name: 'Swim', description: '55 min swimming', duration: 55, tss: 44 },
        { day: 5, type: 'bike', name: 'Race Simulation', description: '120 km (last 40 km race effort) + 8 km brick @ HIM pace', duration: 280, tss: 220 },
        { day: 6, type: 'run', name: 'Long Run', description: '14 km easy', duration: 84, tss: 75 },
      ]
    },
    // WEEK 14 - Peak (Biggest Week)
    {
      week: 14,
      phase: "Peak",
      days: [
        { day: 0, type: 'rest', name: 'Rest / Mobility', description: 'Active recovery', duration: 0, tss: 0 },
        { day: 1, type: 'run', name: 'Tempo Run', description: '35 min steady', duration: 55, tss: 65 },
        { day: 2, type: 'bike', name: 'Easy Bike', description: '60 min easy spinning', duration: 60, tss: 42 },
        { day: 3, type: 'run', name: 'Easy Run', description: '7 km easy', duration: 42, tss: 35 },
        { day: 4, type: 'swim', name: 'Swim', description: '55 min swimming', duration: 55, tss: 44 },
        { day: 5, type: 'bike', name: 'Key Brick', description: '90 km @ race effort + 10-12 km @ HIM pace', duration: 250, tss: 210 },
        { day: 6, type: 'run', name: 'Long Run', description: '18 km', duration: 108, tss: 98 },
      ]
    },
    // WEEK 15 - Peak Down Week
    {
      week: 15,
      phase: "Peak (Recovery)",
      days: [
        { day: 0, type: 'rest', name: 'Rest / Mobility', description: 'Recovery week - reduce volume 25%', duration: 0, tss: 0 },
        { day: 1, type: 'run', name: 'Easy Run', description: '6 km with short race-pace efforts', duration: 40, tss: 38 },
        { day: 2, type: 'bike', name: 'Easy Bike', description: '60 min with 2×5 min race pace', duration: 60, tss: 50 },
        { day: 3, type: 'run', name: 'Easy Run', description: '6 km easy', duration: 36, tss: 28 },
        { day: 4, type: 'swim', name: 'Swim Easy', description: '45 min swimming', duration: 45, tss: 35 },
        { day: 5, type: 'bike', name: 'Moderate Bike', description: '70 km controlled', duration: 135, tss: 95 },
        { day: 6, type: 'run', name: 'Long Run', description: '12 km easy', duration: 72, tss: 62 },
      ]
    },
    // WEEK 16 - Last Hard Week
    {
      week: 16,
      phase: "Peak",
      days: [
        { day: 0, type: 'rest', name: 'Rest / Mobility', description: 'Active recovery', duration: 0, tss: 0 },
        { day: 1, type: 'run', name: 'Tempo Run', description: '25 min steady', duration: 45, tss: 52 },
        { day: 2, type: 'bike', name: 'Tempo Bike', description: '75 min with race pace efforts', duration: 75, tss: 68 },
        { day: 3, type: 'run', name: 'Easy Run + Strides', description: '7 km + strides', duration: 45, tss: 42 },
        { day: 4, type: 'swim', name: 'Swim', description: '50 min swimming', duration: 50, tss: 40 },
        { day: 5, type: 'bike', name: 'Race Pace Brick', description: '100 km w/ race pace + 8 km controlled brick', duration: 220, tss: 175 },
        { day: 6, type: 'run', name: 'Long Run', description: '14 km', duration: 84, tss: 75 },
      ]
    },
    // WEEK 17 - Taper
    {
      week: 17,
      phase: "Taper",
      days: [
        { day: 0, type: 'rest', name: 'Rest', description: 'Complete rest', duration: 0, tss: 0 },
        { day: 1, type: 'run', name: 'Easy Run', description: '5 km easy with strides', duration: 32, tss: 28 },
        { day: 2, type: 'bike', name: 'Easy Bike', description: '50 min easy', duration: 50, tss: 35 },
        { day: 3, type: 'run', name: 'Easy Run', description: '5 km easy', duration: 30, tss: 24 },
        { day: 4, type: 'swim', name: 'Swim Easy', description: '40 min easy', duration: 40, tss: 30 },
        { day: 5, type: 'bike', name: 'Brick', description: '60 km bike + 6 km run (volume ~70%)', duration: 150, tss: 105 },
        { day: 6, type: 'run', name: 'Easy Run', description: '8 km very easy', duration: 48, tss: 38 },
      ]
    },
    // WEEK 18 - Race Week
    {
      week: 18,
      phase: "Race Week",
      days: [
        { day: 0, type: 'rest', name: 'Rest', description: 'Complete rest', duration: 0, tss: 0 },
        { day: 1, type: 'bike', name: 'Opener Bike', description: '40 min with 2×5 min race pace', duration: 40, tss: 35 },
        { day: 2, type: 'run', name: 'Opener Run', description: '30 min + strides', duration: 30, tss: 28 },
        { day: 3, type: 'swim', name: 'Swim Shakeout', description: '30 min easy', duration: 30, tss: 22 },
        { day: 4, type: 'rest', name: 'Rest', description: 'Complete rest - race prep', duration: 0, tss: 0 },
        { day: 5, type: 'bike', name: 'Race Day Shakeout', description: '10 min bike + 5 min jog', duration: 15, tss: 10 },
        { day: 6, type: 'run', name: 'RACE DAY', description: '70.3 Half Ironman - 1.9km swim, 90km bike, 21.1km run', duration: 330, tss: 280 },
      ]
    },
  ]
};

// Helper to generate workouts from plan based on race date
export const generateWorkoutsFromPlan = (plan, raceDate) => {
  const workouts = [];
  const raceDateObj = new Date(raceDate);

  // Calculate start date (18 weeks before race, starting on Monday)
  const startDate = new Date(raceDateObj);
  startDate.setDate(startDate.getDate() - (plan.totalWeeks * 7) + 1);

  // Adjust to Monday if needed
  const dayOfWeek = startDate.getDay();
  const daysToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  startDate.setDate(startDate.getDate() + daysToMonday);

  plan.weeks.forEach((week) => {
    week.days.forEach((day) => {
      const workoutDate = new Date(startDate);
      workoutDate.setDate(workoutDate.getDate() + ((week.week - 1) * 7) + day.day);

      const dateStr = workoutDate.toISOString().split('T')[0];

      workouts.push({
        id: `plan-w${week.week}-d${day.day}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
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
