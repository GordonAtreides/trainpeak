import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'trainpeak_workouts';

// Sample data for first-time users
const getSampleWorkouts = () => {
  const today = new Date();
  const workouts = [];

  // Create some sample workouts for the current week and past
  const sampleData = [
    { daysAgo: 0, type: 'run', name: 'Recovery Run', duration: 40, tss: 35, completed: false },
    { daysAgo: 1, type: 'bike', name: 'Tempo Ride', duration: 60, tss: 75, completed: true, actualDuration: 62, actualTss: 78 },
    { daysAgo: 2, type: 'strength', name: 'Upper Body', duration: 45, tss: 27, completed: true, actualDuration: 45, actualTss: 30 },
    { daysAgo: 3, type: 'run', name: 'Interval Training', duration: 50, tss: 65, completed: true, actualDuration: 52, actualTss: 70 },
    { daysAgo: 4, type: 'rest', name: 'Rest Day', duration: 0, tss: 0, completed: true },
    { daysAgo: 5, type: 'swim', name: 'Endurance Swim', duration: 45, tss: 40, completed: true, actualDuration: 45, actualTss: 42 },
    { daysAgo: 6, type: 'bike', name: 'Long Ride', duration: 120, tss: 140, completed: true, actualDuration: 115, actualTss: 135 },
    { daysAgo: 7, type: 'run', name: 'Easy Run', duration: 35, tss: 30, completed: true, actualDuration: 35, actualTss: 28 },
    { daysAgo: -1, type: 'run', name: 'Tempo Run', duration: 45, tss: 55, completed: false },
    { daysAgo: -2, type: 'bike', name: 'Endurance Ride', duration: 90, tss: 85, completed: false },
    { daysAgo: -3, type: 'strength', name: 'Core & Legs', duration: 50, tss: 30, completed: false },
  ];

  sampleData.forEach(({ daysAgo, type, name, duration, tss, completed, actualDuration, actualTss }) => {
    const date = new Date(today);
    date.setDate(today.getDate() - daysAgo);
    const dateStr = date.toISOString().split('T')[0];

    workouts.push({
      id: uuidv4(),
      date: dateStr,
      planned: { type, name, description: '', duration, tss },
      completed: completed ? {
        duration: actualDuration ?? duration,
        tss: actualTss ?? tss,
        avgHr: type !== 'rest' ? Math.floor(Math.random() * 30) + 120 : null,
        notes: '',
      } : null,
    });
  });

  return workouts;
};

export const useWorkouts = () => {
  const [workouts, setWorkouts] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load workouts from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setWorkouts(JSON.parse(stored));
      } else {
        // First time user - load sample data
        const sampleWorkouts = getSampleWorkouts();
        setWorkouts(sampleWorkouts);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleWorkouts));
      }
    } catch (error) {
      console.error('Error loading workouts:', error);
      setWorkouts([]);
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage whenever workouts change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(workouts));
    }
  }, [workouts, isLoaded]);

  // Get workout for a specific date
  const getWorkoutByDate = useCallback((date) => {
    return workouts.find(w => w.date === date);
  }, [workouts]);

  // Get all workouts for a date range
  const getWorkoutsInRange = useCallback((startDate, endDate) => {
    return workouts.filter(w => w.date >= startDate && w.date <= endDate);
  }, [workouts]);

  // Add a new workout
  const addWorkout = useCallback((workout) => {
    const newWorkout = {
      ...workout,
      id: uuidv4(),
    };
    setWorkouts(prev => [...prev, newWorkout]);
    return newWorkout;
  }, []);

  // Update an existing workout
  const updateWorkout = useCallback((id, updates) => {
    setWorkouts(prev =>
      prev.map(w => (w.id === id ? { ...w, ...updates } : w))
    );
  }, []);

  // Delete a workout
  const deleteWorkout = useCallback((id) => {
    setWorkouts(prev => prev.filter(w => w.id !== id));
  }, []);

  // Toggle workout completion
  const toggleComplete = useCallback((id) => {
    setWorkouts(prev =>
      prev.map(w => {
        if (w.id !== id) return w;

        if (w.completed) {
          return { ...w, completed: null };
        }

        return {
          ...w,
          completed: {
            duration: w.planned?.duration || 0,
            tss: w.planned?.tss || 0,
            avgHr: null,
            notes: '',
          },
        };
      })
    );
  }, []);

  // Clear all data (for testing)
  const clearAll = useCallback(() => {
    setWorkouts([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  // Reset to sample data
  const resetToSample = useCallback(() => {
    const sampleWorkouts = getSampleWorkouts();
    setWorkouts(sampleWorkouts);
  }, []);

  // Clear sample/manual data, keep only Strava workouts
  const clearSampleData = useCallback(() => {
    setWorkouts(prev => prev.filter(w => w.stravaId));
  }, []);

  // Merge Strava activities into workouts
  // Strava activities take priority over manual workouts on the same date
  // BUT we preserve training plan workouts (they coexist with Strava activities)
  const mergeStravaActivities = useCallback((stravaWorkouts) => {
    console.log('Merging Strava workouts:', stravaWorkouts.length);
    setWorkouts(prev => {
      console.log('Existing workouts:', prev.length);

      // Get all dates that have Strava activities
      const stravaDates = new Set(stravaWorkouts.map(sw => sw.date));

      // Keep:
      // 1. Training plan workouts (source === 'plan') - always keep these
      // 2. Manual workouts that DON'T conflict with Strava dates
      const keptWorkouts = prev.filter(workout => {
        if (workout.stravaId) return false; // Old Strava workout, will be replaced
        if (workout.source === 'plan') return true; // Always keep plan workouts
        return !stravaDates.has(workout.date); // Keep manual if no Strava on this date
      });

      console.log('Keeping workouts:', keptWorkouts.length);
      console.log('Strava dates:', [...stravaDates]);

      const result = [...keptWorkouts, ...stravaWorkouts];
      console.log('Merged result:', result.length, 'workouts', result);
      return result;
    });
  }, []);

  // Load a training plan
  // Keeps Strava activities and completed workouts, replaces planned workouts
  const loadTrainingPlan = useCallback((planWorkouts) => {
    setWorkouts(prev => {
      // Keep Strava activities and manually completed workouts
      const keepWorkouts = prev.filter(w => w.stravaId || w.completed);

      // Get dates that already have completed workouts
      const completedDates = new Set(keepWorkouts.map(w => w.date));

      // Filter plan workouts to not overlap with completed workouts
      const newPlanWorkouts = planWorkouts.filter(pw => !completedDates.has(pw.date));

      return [...keepWorkouts, ...newPlanWorkouts];
    });
  }, []);

  // Clear training plan (remove all plan-sourced workouts)
  const clearTrainingPlan = useCallback(() => {
    setWorkouts(prev => prev.filter(w => w.source !== 'plan'));
  }, []);

  return {
    workouts,
    isLoaded,
    getWorkoutByDate,
    getWorkoutsInRange,
    addWorkout,
    updateWorkout,
    deleteWorkout,
    toggleComplete,
    clearAll,
    resetToSample,
    clearSampleData,
    mergeStravaActivities,
    loadTrainingPlan,
    clearTrainingPlan,
  };
};
