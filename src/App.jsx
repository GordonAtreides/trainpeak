import { useState, useEffect, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { MetricsBar } from './components/MetricsBar';
import { Calendar, getWeekDates } from './components/Calendar';
import { MonthCalendar } from './components/MonthCalendar';
import { Performance } from './components/Performance';
import { WorkoutModal } from './components/WorkoutModal';
import { SettingsModal } from './components/SettingsModal';
import { StravaCallback } from './components/StravaCallback';
import { Login } from './components/Login';
import { useWorkouts } from './hooks/useWorkouts';
import { useMetrics } from './hooks/useMetrics';
import { useStrava } from './hooks/useStrava';
import { useGuardrails } from './hooks/useGuardrails';
import { useRaceGoal } from './hooks/useRaceGoal';
import { useTemplates } from './hooks/useTemplates';
import { useAuth } from './hooks/useAuth';
import { formatDate } from './utils/dateUtils';
import { Link2, X } from 'lucide-react';

function App() {
  const [currentView, setCurrentView] = useState('calendar');
  const [calendarView, setCalendarView] = useState('week'); // 'week' or 'month'
  const [currentWeekDates, setCurrentWeekDates] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [isCallback, setIsCallback] = useState(false);

  // Authentication
  const auth = useAuth();

  const {
    workouts,
    isLoaded,
    addWorkout,
    updateWorkout,
    deleteWorkout,
    clearSampleData,
    mergeStravaActivities,
    loadTrainingPlan,
  } = useWorkouts();

  // Handle Strava activity sync
  const handleStravaSync = useCallback((stravaWorkouts) => {
    mergeStravaActivities(stravaWorkouts);
  }, [mergeStravaActivities]);

  const strava = useStrava(handleStravaSync);

  const { templates, addTemplate } = useTemplates();

  // Check if this is an OAuth callback
  useEffect(() => {
    const path = window.location.pathname;
    const params = new URLSearchParams(window.location.search);
    if (path === '/callback' || params.has('code')) {
      setIsCallback(true);
    }
  }, []);

  // Update week dates when component mounts
  useEffect(() => {
    setCurrentWeekDates(getWeekDates(formatDate(new Date())));
  }, []);

  const metrics = useMetrics(workouts, currentWeekDates);

  // Race goal hook - use current week's average TSS as base
  const avgWeeklyTSS = metrics.weeklyTSS?.completed || 300;
  const raceGoalHook = useRaceGoal(metrics.ctl, avgWeeklyTSS);

  // Guardrails hook - pass weekly target if race goal is set
  const weeklyTarget = raceGoalHook.weekTarget?.targetTSS || null;
  const guardrails = useGuardrails(workouts, weeklyTarget);

  const handleDayClick = (date, workout) => {
    setSelectedDate(date);
    setSelectedWorkout(workout || null);
    setModalOpen(true);
  };

  const handleSaveWorkout = (workoutData) => {
    if (workoutData.id) {
      updateWorkout(workoutData.id, workoutData);
    } else {
      addWorkout(workoutData);
    }
  };

  const handleDeleteWorkout = (id) => {
    deleteWorkout(id);
  };

  const handleMoveWorkout = (workoutId, newDate) => {
    updateWorkout(workoutId, { date: newDate });
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedDate(null);
    setSelectedWorkout(null);
  };

  // Handle OAuth callback
  if (isCallback) {
    return (
      <StravaCallback
        onSuccess={strava.handleCallback}
        onError={(err) => console.error('Strava auth error:', err)}
      />
    );
  }

  // Auth loading state
  if (auth.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="text-zinc-500">Loading...</div>
      </div>
    );
  }

  // Show login if not authenticated
  if (!auth.isAuthenticated) {
    return (
      <Login
        onSignIn={auth.signIn}
        onSignUp={auth.signUp}
        onResetPassword={auth.resetPassword}
        loading={auth.loading}
        error={auth.error}
      />
    );
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="text-zinc-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <Sidebar
        currentView={currentView}
        onViewChange={setCurrentView}
        onSettingsClick={() => setSettingsOpen(true)}
        user={auth.user}
        onSignOut={auth.signOut}
      />

      <main className="flex-1 p-4 lg:p-6">
        {currentView === 'calendar' ? (
          <div>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
              <div>
                <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Training Calendar</h1>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Plan and track your workouts</p>
              </div>
              {/* Week/Month toggle */}
              <div className="flex rounded-lg p-1 self-start sm:self-auto" style={{ backgroundColor: 'var(--bg-card)' }}>
                <button
                  onClick={() => setCalendarView('week')}
                  className="px-4 py-2.5 min-h-[44px] text-sm font-medium rounded-md transition-all shadow-lg"
                  style={{
                    backgroundColor: calendarView === 'week' ? 'var(--bg-elevated)' : 'transparent',
                    color: calendarView === 'week' ? 'var(--text-primary)' : 'var(--text-secondary)',
                  }}
                >
                  Week
                </button>
                <button
                  onClick={() => setCalendarView('month')}
                  className="px-4 py-2.5 min-h-[44px] text-sm font-medium rounded-md transition-all shadow-lg"
                  style={{
                    backgroundColor: calendarView === 'month' ? 'var(--bg-elevated)' : 'transparent',
                    color: calendarView === 'month' ? 'var(--text-primary)' : 'var(--text-secondary)',
                  }}
                >
                  Month
                </button>
              </div>
            </div>

            {/* Strava Connection Banner */}
            {strava.isConfigured && !strava.isConnected && (
              <div
                className="mb-4 p-4 rounded-xl flex items-center justify-between"
                style={{
                  background: 'linear-gradient(135deg, rgba(252, 76, 2, 0.1), rgba(255, 107, 43, 0.1))',
                  border: '1px solid rgba(252, 76, 2, 0.3)',
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: 'rgba(252, 76, 2, 0.2)' }}
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#FC4C02">
                      <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.598h4.172L10.463 0l-7 13.828h4.169" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium" style={{ color: 'var(--text-primary)' }}>
                      Connect to Strava
                    </p>
                    <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                      Import your workouts automatically
                    </p>
                  </div>
                </div>
                <button
                  onClick={strava.connect}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all"
                  style={{
                    background: 'linear-gradient(135deg, #fc4c02, #ff6b2b)',
                    color: 'white',
                  }}
                >
                  <Link2 size={16} />
                  Connect
                </button>
              </div>
            )}

            {/* Metrics Bar - Above Calendar */}
            <div className="mb-4">
              <MetricsBar
                ctl={metrics.ctl}
                atl={metrics.atl}
                tsb={metrics.tsb}
                formStatus={metrics.formStatus}
                weeklyTSS={metrics.weeklyTSS}
                compact={false}
              />
            </div>

            {/* Calendar - Full Width */}
            {calendarView === 'week' ? (
              <Calendar
                workouts={workouts}
                onDayClick={handleDayClick}
                onMoveWorkout={handleMoveWorkout}
              />
            ) : (
              <MonthCalendar
                workouts={workouts}
                onDayClick={handleDayClick}
              />
            )}
          </div>
        ) : (
          <Performance
            workouts={workouts}
            guardrails={guardrails}
            raceGoal={raceGoalHook}
            onSetGoalClick={() => setSettingsOpen(true)}
          />
        )}
      </main>

      {/* Workout Modal */}
      <WorkoutModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        date={selectedDate}
        workout={selectedWorkout}
        onSave={handleSaveWorkout}
        onDelete={handleDeleteWorkout}
        templates={templates}
        onSaveTemplate={addTemplate}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        strava={strava}
        onClearSampleData={clearSampleData}
        raceGoal={raceGoalHook}
        onLoadTrainingPlan={loadTrainingPlan}
      />
    </div>
  );
}

export default App;
