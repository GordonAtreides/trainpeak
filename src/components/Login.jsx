import { useState } from 'react';
import { Flame, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';

export const Login = ({ onSignIn, onSignUp, loading, error }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');

    if (!email || !password) {
      setLocalError('Please fill in all fields');
      return;
    }

    if (isSignUp) {
      if (password !== confirmPassword) {
        setLocalError('Passwords do not match');
        return;
      }
      if (password.length < 6) {
        setLocalError('Password must be at least 6 characters');
        return;
      }
      const { error } = await onSignUp(email, password);
      if (!error) {
        setLocalError('Check your email for a confirmation link!');
      }
    } else {
      await onSignIn(email, password);
    }
  };

  const displayError = localError || error;

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: 'var(--bg-primary)' }}
    >
      <div
        className="w-full max-w-md rounded-2xl p-8"
        style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border)',
        }}
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg mb-4"
            style={{
              background: 'linear-gradient(135deg, #fc4c02, #ff6b2b)',
            }}
          >
            <Flame className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            TrainPeak
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
            {isSignUp ? 'Create your account' : 'Sign in to continue'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: 'var(--text-secondary)' }}
            >
              Email
            </label>
            <div className="relative">
              <Mail
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5"
                style={{ color: 'var(--text-muted)' }}
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                className="w-full pl-10 pr-4 py-3 rounded-lg outline-none transition-all"
                style={{
                  backgroundColor: 'var(--bg-elevated)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-primary)',
                }}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: 'var(--text-secondary)' }}
            >
              Password
            </label>
            <div className="relative">
              <Lock
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5"
                style={{ color: 'var(--text-muted)' }}
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                autoComplete={isSignUp ? 'new-password' : 'current-password'}
                className="w-full pl-10 pr-4 py-3 rounded-lg outline-none transition-all"
                style={{
                  backgroundColor: 'var(--bg-elevated)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-primary)',
                }}
              />
            </div>
          </div>

          {/* Confirm Password (Sign Up only) */}
          {isSignUp && (
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: 'var(--text-secondary)' }}
              >
                Confirm Password
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5"
                  style={{ color: 'var(--text-muted)' }}
                />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  autoComplete="new-password"
                  className="w-full pl-10 pr-4 py-3 rounded-lg outline-none transition-all"
                  style={{
                    backgroundColor: 'var(--bg-elevated)',
                    border: '1px solid var(--border)',
                    color: 'var(--text-primary)',
                  }}
                />
              </div>
            </div>
          )}

          {/* Error Message */}
          {displayError && (
            <div
              className="p-3 rounded-lg text-sm"
              style={{
                backgroundColor: displayError.includes('Check your email')
                  ? 'rgba(34, 197, 94, 0.1)'
                  : 'rgba(239, 68, 68, 0.1)',
                color: displayError.includes('Check your email')
                  ? '#22c55e'
                  : '#ef4444',
                border: `1px solid ${displayError.includes('Check your email') ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
              }}
            >
              {displayError}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            style={{
              background: 'linear-gradient(135deg, #fc4c02, #ff6b2b)',
              color: 'white',
            }}
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                {isSignUp ? 'Create Account' : 'Sign In'}
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        {/* Toggle Sign In / Sign Up */}
        <div className="mt-6 text-center">
          <p style={{ color: 'var(--text-muted)' }}>
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setLocalError('');
              }}
              className="font-medium hover:underline"
              style={{ color: '#fc4c02' }}
            >
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
