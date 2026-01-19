import { useEffect, useState, useRef } from 'react';
import { CheckCircle, XCircle, Loader } from 'lucide-react';

export const StravaCallback = ({ onSuccess, onError }) => {
  const [status, setStatus] = useState('processing'); // processing, success, error
  const [message, setMessage] = useState('Connecting to Strava...');
  const hasProcessed = useRef(false);

  useEffect(() => {
    const handleCallback = async () => {
      // Prevent double-processing (OAuth codes are single-use)
      if (hasProcessed.current) return;
      hasProcessed.current = true;
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');
      const error = params.get('error');

      if (error) {
        setStatus('error');
        setMessage(error === 'access_denied'
          ? 'You denied access to Strava'
          : `Authorization failed: ${error}`
        );
        if (onError) onError(error);
        return;
      }

      if (!code) {
        setStatus('error');
        setMessage('No authorization code received');
        if (onError) onError('no_code');
        return;
      }

      try {
        const success = await onSuccess(code);
        if (success) {
          setStatus('success');
          setMessage('Successfully connected to Strava!');
          // Redirect after a short delay
          setTimeout(() => {
            window.history.replaceState({}, '', '/');
            window.location.reload();
          }, 1500);
        } else {
          setStatus('error');
          setMessage('Failed to complete authorization');
        }
      } catch (err) {
        setStatus('error');
        setMessage(err.message || 'Failed to connect to Strava');
        if (onError) onError(err);
      }
    };

    handleCallback();
  }, [onSuccess, onError]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
        {status === 'processing' && (
          <>
            <Loader className="w-16 h-16 text-orange-500 animate-spin mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-800 mb-2">Connecting to Strava</h2>
            <p className="text-gray-500">Please wait...</p>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-800 mb-2">Connected!</h2>
            <p className="text-gray-500">{message}</p>
            <p className="text-sm text-gray-400 mt-2">Redirecting...</p>
          </>
        )}

        {status === 'error' && (
          <>
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-800 mb-2">Connection Failed</h2>
            <p className="text-gray-500 mb-4">{message}</p>
            <button
              onClick={() => {
                window.history.replaceState({}, '', '/');
                window.location.reload();
              }}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              Back to App
            </button>
          </>
        )}
      </div>
    </div>
  );
};
