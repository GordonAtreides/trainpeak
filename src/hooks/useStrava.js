import { useState, useEffect, useCallback } from 'react';
import {
  isStravaConfigured,
  isStravaConnected,
  getStravaAthlete,
  initiateStravaAuth,
  exchangeCodeForToken,
  disconnectStrava,
  fetchLast90DaysActivities,
  stravaActivityToWorkout,
} from '../services/strava';

export const useStrava = (onActivitiesSync) => {
  const [isConfigured] = useState(isStravaConfigured);
  const [isConnected, setIsConnected] = useState(false);
  const [athlete, setAthlete] = useState(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState(null);
  const [error, setError] = useState(null);

  // Check connection status on mount
  useEffect(() => {
    setIsConnected(isStravaConnected());
    setAthlete(getStravaAthlete());

    const storedLastSync = localStorage.getItem('strava_last_sync');
    if (storedLastSync) {
      setLastSync(new Date(storedLastSync));
    }
  }, []);

  // Handle OAuth callback
  const handleCallback = useCallback(async (code) => {
    try {
      setError(null);
      const data = await exchangeCodeForToken(code);
      setIsConnected(true);
      setAthlete(data.athlete);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  }, []);

  // Connect to Strava
  const connect = useCallback(() => {
    if (!isConfigured) {
      setError('Strava is not configured. Add VITE_STRAVA_CLIENT_ID to .env');
      return;
    }
    initiateStravaAuth();
  }, [isConfigured]);

  // Disconnect from Strava
  const disconnect = useCallback(() => {
    disconnectStrava();
    setIsConnected(false);
    setAthlete(null);
    setLastSync(null);
    localStorage.removeItem('strava_last_sync');
  }, []);

  // Sync activities from Strava
  const syncActivities = useCallback(async () => {
    if (!isConnected) {
      setError('Not connected to Strava');
      return [];
    }

    setIsSyncing(true);
    setError(null);

    try {
      const activities = await fetchLast90DaysActivities();
      console.log('Fetched activities from Strava:', activities.length, activities);
      const workouts = activities.map(stravaActivityToWorkout);
      console.log('Converted to workouts:', workouts);

      // Update last sync time
      const now = new Date();
      setLastSync(now);
      localStorage.setItem('strava_last_sync', now.toISOString());

      // Call the callback to merge workouts
      if (onActivitiesSync) {
        onActivitiesSync(workouts);
      }

      return workouts;
    } catch (err) {
      setError(err.message);
      return [];
    } finally {
      setIsSyncing(false);
    }
  }, [isConnected, onActivitiesSync]);

  return {
    isConfigured,
    isConnected,
    athlete,
    isSyncing,
    lastSync,
    error,
    connect,
    disconnect,
    syncActivities,
    handleCallback,
    clearError: () => setError(null),
  };
};
