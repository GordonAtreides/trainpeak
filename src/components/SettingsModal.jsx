import { useState } from 'react';
import { X, Link2, Unlink, RefreshCw, AlertCircle, CheckCircle, Target, Trash2, Calendar, Dumbbell } from 'lucide-react';
import { triathlon703Plan, generateWorkoutsFromPlan } from '../data/triathlon703Plan';

export const SettingsModal = ({
  isOpen,
  onClose,
  strava,
  onClearSampleData,
  raceGoal,
  onLoadTrainingPlan,
}) => {
  const [raceName, setRaceName] = useState('');
  const [raceDate, setRaceDate] = useState('');
  const [raceType, setRaceType] = useState('run');
  const [planLoading, setPlanLoading] = useState(false);
  const [planLoaded, setPlanLoaded] = useState(false);

  if (!isOpen) return null;

  const {
    isConfigured,
    isConnected,
    athlete,
    isSyncing,
    lastSync,
    error,
    connect,
    disconnect,
    syncActivities,
    clearError,
  } = strava;

  const formatLastSync = (date) => {
    if (!date) return 'Never';
    return new Date(date).toLocaleString();
  };

  const handleLoadPlan = () => {
    if (!raceGoal?.hasGoal || !onLoadTrainingPlan) return;

    setPlanLoading(true);
    try {
      const workouts = generateWorkoutsFromPlan(triathlon703Plan, raceGoal.raceGoal.raceDate);
      onLoadTrainingPlan(workouts);
      setPlanLoaded(true);
      setTimeout(() => setPlanLoaded(false), 3000);
    } catch (err) {
      console.error('Error loading plan:', err);
    }
    setPlanLoading(false);
  };

  const inputStyle = {
    backgroundColor: 'var(--bg-elevated)',
    border: '1px solid var(--border)',
    color: 'var(--text-primary)',
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50" onClick={onClose} />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--border)',
          }}
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between p-6"
            style={{ borderBottom: '1px solid var(--border)' }}
          >
            <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Settings</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg transition-colors hover:bg-white/5"
            >
              <X size={20} className="text-zinc-400" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Strava Integration Section */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#FC4C02">
                  <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.598h4.172L10.463 0l-7 13.828h4.169" />
                </svg>
                Strava Integration
              </h3>

              {/* Error Message */}
              {error && (
                <div
                  className="mb-4 p-3 rounded-lg flex items-start gap-2"
                  style={{
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                  }}
                >
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-red-400">{error}</p>
                    <button
                      onClick={clearError}
                      className="text-xs text-red-500 hover:text-red-400 mt-1"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              )}

              {!isConfigured ? (
                <div
                  className="p-4 rounded-lg"
                  style={{
                    backgroundColor: 'rgba(245, 158, 11, 0.1)',
                    border: '1px solid rgba(245, 158, 11, 0.3)',
                  }}
                >
                  <p className="text-sm text-amber-400 mb-2">
                    Strava integration requires configuration.
                  </p>
                  <p className="text-xs text-amber-500">
                    Create a <code className="px-1 rounded" style={{ backgroundColor: 'rgba(245, 158, 11, 0.2)' }}>.env</code> file with:
                  </p>
                  <pre
                    className="mt-2 p-2 rounded text-xs text-amber-400 overflow-x-auto"
                    style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)' }}
                  >
{`VITE_STRAVA_CLIENT_ID=your_client_id
VITE_STRAVA_CLIENT_SECRET=your_secret
VITE_STRAVA_REDIRECT_URI=http://localhost:5173/callback`}
                  </pre>
                  <p className="text-xs text-amber-500 mt-2">
                    Get credentials at{' '}
                    <a
                      href="https://www.strava.com/settings/api"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline hover:text-amber-400"
                    >
                      strava.com/settings/api
                    </a>
                  </p>
                </div>
              ) : isConnected ? (
                <div className="space-y-4">
                  {/* Connected Status */}
                  <div
                    className="p-4 rounded-lg"
                    style={{
                      backgroundColor: 'rgba(34, 197, 94, 0.1)',
                      border: '1px solid rgba(34, 197, 94, 0.3)',
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-emerald-500" />
                      <div className="flex-1">
                        <p className="font-medium text-emerald-400">
                          Connected to Strava
                        </p>
                        {athlete && (
                          <p className="text-sm text-emerald-500">
                            {athlete.firstname} {athlete.lastname}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Sync Info */}
                  <div className="flex items-center justify-between text-sm text-zinc-500">
                    <span>Last synced: {formatLastSync(lastSync)}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <button
                      onClick={syncActivities}
                      disabled={isSyncing}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all"
                      style={{
                        background: isSyncing ? 'var(--bg-elevated)' : 'linear-gradient(135deg, #fc4c02, #ff6b2b)',
                        color: isSyncing ? '#71717a' : 'white',
                        cursor: isSyncing ? 'not-allowed' : 'pointer',
                      }}
                    >
                      <RefreshCw size={18} className={isSyncing ? 'animate-spin' : ''} />
                      {isSyncing ? 'Syncing...' : 'Sync Activities'}
                    </button>
                    <button
                      onClick={disconnect}
                      className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-zinc-400 hover:text-white transition-colors"
                      style={{
                        backgroundColor: 'var(--bg-elevated)',
                        border: '1px solid var(--border)',
                      }}
                    >
                      <Unlink size={18} />
                      Disconnect
                    </button>
                  </div>

                  <p className="text-xs text-zinc-600">
                    Syncing will import the last 90 days of activities from Strava.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm text-zinc-400">
                    Connect your Strava account to automatically import your activities.
                  </p>
                  <button
                    onClick={connect}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all"
                    style={{
                      background: 'linear-gradient(135deg, #fc4c02, #ff6b2b)',
                      color: 'white',
                    }}
                  >
                    <Link2 size={18} />
                    Connect with Strava
                  </button>
                </div>
              )}
            </div>

            {/* Divider */}
            <hr style={{ borderColor: 'var(--border)' }} />

            {/* Race Goal Section */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                <Target className="w-5 h-5" style={{ color: '#fc4c02' }} />
                Race Goal
              </h3>

              {raceGoal?.hasGoal ? (
                <div className="space-y-4">
                  {/* Current Goal */}
                  <div
                    className="p-4 rounded-lg"
                    style={{
                      backgroundColor: 'rgba(252, 76, 2, 0.1)',
                      border: '1px solid rgba(252, 76, 2, 0.3)',
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium" style={{ color: '#fc4c02' }}>
                          {raceGoal.raceGoal.raceName}
                        </p>
                        <p className="text-sm text-zinc-400">
                          {new Date(raceGoal.raceGoal.raceDate).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                        {raceGoal.countdown && (
                          <p className="text-sm text-zinc-500 mt-1">
                            {raceGoal.countdown.text}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => {
                          if (window.confirm('Remove this race goal?')) {
                            raceGoal.clearGoal();
                          }
                        }}
                        className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm text-zinc-400">
                    Set a race goal to get personalized weekly TSS targets with build, peak, and taper phases.
                  </p>

                  {/* Race Name */}
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-1">
                      Race Name
                    </label>
                    <input
                      type="text"
                      value={raceName}
                      onChange={(e) => setRaceName(e.target.value)}
                      placeholder="e.g., Brighton Marathon"
                      className="w-full px-3 py-2 rounded-lg outline-none placeholder-zinc-600"
                      style={inputStyle}
                    />
                  </div>

                  {/* Race Date */}
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-1">
                      Race Date
                    </label>
                    <input
                      type="date"
                      value={raceDate}
                      onChange={(e) => setRaceDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-3 py-2 rounded-lg outline-none"
                      style={inputStyle}
                    />
                  </div>

                  {/* Race Type */}
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-1">
                      Race Type
                    </label>
                    <select
                      value={raceType}
                      onChange={(e) => setRaceType(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg outline-none"
                      style={inputStyle}
                    >
                      <option value="run">Running</option>
                      <option value="bike">Cycling</option>
                      <option value="swim">Swimming</option>
                      <option value="triathlon">Triathlon</option>
                    </select>
                  </div>

                  {/* Set Goal Button */}
                  <button
                    onClick={() => {
                      if (raceName && raceDate) {
                        raceGoal.setGoal(raceName, raceDate, raceType);
                        setRaceName('');
                        setRaceDate('');
                        setRaceType('run');
                      }
                    }}
                    disabled={!raceName || !raceDate}
                    className="w-full px-4 py-2.5 rounded-lg font-medium transition-all"
                    style={{
                      background: raceName && raceDate
                        ? 'linear-gradient(135deg, #fc4c02, #ff6b2b)'
                        : 'var(--bg-elevated)',
                      color: raceName && raceDate ? 'white' : '#71717a',
                      cursor: raceName && raceDate ? 'pointer' : 'not-allowed',
                    }}
                  >
                    Set Race Goal
                  </button>
                </div>
              )}
            </div>

            {/* Training Plan Section - Only show if race goal is set */}
            {raceGoal?.hasGoal && (
              <>
                <hr style={{ borderColor: 'var(--border)' }} />

                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                    <Dumbbell className="w-5 h-5" style={{ color: '#10b981' }} />
                    Training Plan
                  </h3>

                  <div
                    className="p-4 rounded-lg"
                    style={{
                      backgroundColor: 'var(--bg-card)',
                      border: '1px solid var(--border)',
                    }}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}
                      >
                        <Calendar className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold" style={{ color: 'var(--text-primary)' }}>{triathlon703Plan.name}</h4>
                        <p className="text-sm text-zinc-400 mt-1">
                          {triathlon703Plan.description}
                        </p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <span className="px-2 py-0.5 text-xs rounded-full" style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
                            Weeks 1-6: Base
                          </span>
                          <span className="px-2 py-0.5 text-xs rounded-full" style={{ backgroundColor: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' }}>
                            Weeks 7-12: Build
                          </span>
                          <span className="px-2 py-0.5 text-xs rounded-full" style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#ef4444' }}>
                            Weeks 13-16: Peak
                          </span>
                          <span className="px-2 py-0.5 text-xs rounded-full" style={{ backgroundColor: 'rgba(14, 165, 233, 0.15)', color: '#0ea5e9' }}>
                            Weeks 17-18: Taper
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={handleLoadPlan}
                      disabled={planLoading}
                      className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all"
                      style={{
                        background: planLoaded
                          ? 'rgba(34, 197, 94, 0.2)'
                          : planLoading
                          ? 'var(--bg-elevated)'
                          : 'linear-gradient(135deg, #10b981, #059669)',
                        color: planLoaded ? '#22c55e' : planLoading ? '#71717a' : 'white',
                        border: planLoaded ? '1px solid rgba(34, 197, 94, 0.3)' : 'none',
                      }}
                    >
                      {planLoaded ? (
                        <>
                          <CheckCircle size={18} />
                          Plan Loaded!
                        </>
                      ) : planLoading ? (
                        <>
                          <RefreshCw size={18} className="animate-spin" />
                          Loading...
                        </>
                      ) : (
                        <>
                          <Calendar size={18} />
                          Load 18-Week Plan
                        </>
                      )}
                    </button>

                    <p className="text-xs text-zinc-600 mt-2 text-center">
                      This will add {triathlon703Plan.totalWeeks * 7} workouts to your calendar
                    </p>
                  </div>
                </div>
              </>
            )}

            {/* Divider */}
            <hr style={{ borderColor: 'var(--border)' }} />

            {/* Data Management */}
            <div>
              <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
                Data Management
              </h3>
              <p className="text-sm text-zinc-500 mb-3">
                All data is stored locally in your browser.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    if (window.confirm('Clear sample/test data and keep only Strava activities?')) {
                      onClearSampleData();
                    }
                  }}
                  className="px-4 py-2 text-sm rounded-lg font-medium transition-all"
                  style={{
                    background: 'linear-gradient(135deg, #fc4c02, #ff6b2b)',
                    color: 'white',
                  }}
                >
                  Clear Sample Data
                </button>
                <button
                  onClick={() => {
                    if (window.confirm('Reset all workout data to sample data?')) {
                      localStorage.removeItem('trainpeak_workouts');
                      window.location.reload();
                    }
                  }}
                  className="px-4 py-2 text-sm rounded-lg text-zinc-400 hover:text-white transition-colors"
                  style={{
                    backgroundColor: 'var(--bg-elevated)',
                    border: '1px solid var(--border)',
                  }}
                >
                  Reset to Sample Data
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
