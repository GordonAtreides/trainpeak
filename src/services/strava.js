// Strava OAuth and API service

const STRAVA_CONFIG = {
  clientId: import.meta.env.VITE_STRAVA_CLIENT_ID || '',
  clientSecret: import.meta.env.VITE_STRAVA_CLIENT_SECRET || '',
  redirectUri: import.meta.env.VITE_STRAVA_REDIRECT_URI || 'http://localhost:5173/callback',
  authUrl: 'https://www.strava.com/oauth/authorize',
  tokenUrl: 'https://www.strava.com/oauth/token',
  apiBase: 'https://www.strava.com/api/v3',
  scope: 'read,activity:read_all',
};

const STORAGE_KEYS = {
  accessToken: 'strava_access_token',
  refreshToken: 'strava_refresh_token',
  expiresAt: 'strava_expires_at',
  athlete: 'strava_athlete',
};

// Check if Strava is configured
export const isStravaConfigured = () => {
  return Boolean(STRAVA_CONFIG.clientId);
};

// Check if user is connected to Strava
export const isStravaConnected = () => {
  const token = localStorage.getItem(STORAGE_KEYS.accessToken);
  const expiresAt = localStorage.getItem(STORAGE_KEYS.expiresAt);

  if (!token) return false;

  // Check if token is expired
  if (expiresAt && Date.now() / 1000 > parseInt(expiresAt)) {
    return false; // Token expired, need to refresh
  }

  return true;
};

// Get stored athlete info
export const getStravaAthlete = () => {
  const athlete = localStorage.getItem(STORAGE_KEYS.athlete);
  return athlete ? JSON.parse(athlete) : null;
};

// Initiate OAuth flow - redirect to Strava
export const initiateStravaAuth = () => {
  if (!STRAVA_CONFIG.clientId) {
    console.error('Strava Client ID not configured');
    return;
  }

  const params = new URLSearchParams({
    client_id: STRAVA_CONFIG.clientId,
    redirect_uri: STRAVA_CONFIG.redirectUri,
    response_type: 'code',
    scope: STRAVA_CONFIG.scope,
    approval_prompt: 'auto',
  });

  window.location.href = `${STRAVA_CONFIG.authUrl}?${params.toString()}`;
};

// Exchange authorization code for tokens
export const exchangeCodeForToken = async (code) => {
  if (!STRAVA_CONFIG.clientId || !STRAVA_CONFIG.clientSecret) {
    throw new Error('Strava credentials not configured');
  }

  const response = await fetch(STRAVA_CONFIG.tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      client_id: STRAVA_CONFIG.clientId,
      client_secret: STRAVA_CONFIG.clientSecret,
      code: code,
      grant_type: 'authorization_code',
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to exchange code for token');
  }

  const data = await response.json();

  // Store tokens
  localStorage.setItem(STORAGE_KEYS.accessToken, data.access_token);
  localStorage.setItem(STORAGE_KEYS.refreshToken, data.refresh_token);
  localStorage.setItem(STORAGE_KEYS.expiresAt, data.expires_at.toString());
  localStorage.setItem(STORAGE_KEYS.athlete, JSON.stringify(data.athlete));

  return data;
};

// Refresh access token
export const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem(STORAGE_KEYS.refreshToken);

  if (!refreshToken) {
    throw new Error('No refresh token available');
  }

  const response = await fetch(STRAVA_CONFIG.tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      client_id: STRAVA_CONFIG.clientId,
      client_secret: STRAVA_CONFIG.clientSecret,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to refresh token');
  }

  const data = await response.json();

  localStorage.setItem(STORAGE_KEYS.accessToken, data.access_token);
  localStorage.setItem(STORAGE_KEYS.refreshToken, data.refresh_token);
  localStorage.setItem(STORAGE_KEYS.expiresAt, data.expires_at.toString());

  return data.access_token;
};

// Get valid access token (refresh if needed)
const getValidToken = async () => {
  const expiresAt = localStorage.getItem(STORAGE_KEYS.expiresAt);

  // Refresh if token expires in less than 5 minutes
  if (expiresAt && Date.now() / 1000 > parseInt(expiresAt) - 300) {
    return await refreshAccessToken();
  }

  return localStorage.getItem(STORAGE_KEYS.accessToken);
};

// Make authenticated API request
const stravaFetch = async (endpoint, options = {}) => {
  const token = await getValidToken();

  if (!token) {
    throw new Error('Not authenticated with Strava');
  }

  const response = await fetch(`${STRAVA_CONFIG.apiBase}${endpoint}`, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      // Token invalid, clear storage
      disconnectStrava();
      throw new Error('Strava session expired. Please reconnect.');
    }
    throw new Error(`Strava API error: ${response.status}`);
  }

  return response.json();
};

// Disconnect from Strava
export const disconnectStrava = () => {
  localStorage.removeItem(STORAGE_KEYS.accessToken);
  localStorage.removeItem(STORAGE_KEYS.refreshToken);
  localStorage.removeItem(STORAGE_KEYS.expiresAt);
  localStorage.removeItem(STORAGE_KEYS.athlete);
};

// Fetch athlete profile
export const fetchAthlete = async () => {
  return stravaFetch('/athlete');
};

// Fetch activities with pagination
export const fetchActivities = async (options = {}) => {
  const {
    before,
    after,
    page = 1,
    perPage = 30,
  } = options;

  const params = new URLSearchParams({
    page: page.toString(),
    per_page: perPage.toString(),
  });

  if (before) params.append('before', Math.floor(before / 1000).toString());
  if (after) params.append('after', Math.floor(after / 1000).toString());

  return stravaFetch(`/athlete/activities?${params.toString()}`);
};

// Fetch last 90 days of activities
export const fetchLast90DaysActivities = async () => {
  const now = Date.now();
  const ninetyDaysAgo = now - (90 * 24 * 60 * 60 * 1000);

  const allActivities = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const activities = await fetchActivities({
      after: ninetyDaysAgo,
      page,
      perPage: 100,
    });

    allActivities.push(...activities);
    hasMore = activities.length === 100;
    page++;

    // Safety limit
    if (page > 10) break;
  }

  return allActivities;
};

// Get detailed activity
export const fetchActivityDetails = async (activityId) => {
  return stravaFetch(`/activities/${activityId}`);
};

// Map Strava activity type to our types
export const mapStravaActivityType = (stravaType) => {
  const typeMap = {
    'Run': 'run',
    'TrailRun': 'run',
    'VirtualRun': 'run',
    'Ride': 'bike',
    'VirtualRide': 'bike',
    'MountainBikeRide': 'bike',
    'GravelRide': 'bike',
    'EBikeRide': 'bike',
    'Swim': 'swim',
    'WeightTraining': 'strength',
    'Workout': 'strength',
    'Yoga': 'strength',
    'CrossFit': 'strength',
  };

  return typeMap[stravaType] || 'run'; // Default to run for unknown types
};

// Calculate TSS from Strava activity
export const calculateTSSFromActivity = (activity) => {
  // If we have power data, use actual TSS calculation
  if (activity.weighted_average_watts && activity.ftp) {
    const intensity = activity.weighted_average_watts / activity.ftp;
    const durationHours = activity.moving_time / 3600;
    return Math.round(intensity * intensity * durationHours * 100);
  }

  // If we have heart rate, estimate hrTSS
  if (activity.average_heartrate && activity.max_heartrate) {
    const hrReserve = (activity.average_heartrate - 60) / (activity.max_heartrate - 60);
    const durationHours = activity.moving_time / 3600;
    return Math.round(hrReserve * hrReserve * durationHours * 100);
  }

  // Fallback: estimate from duration and perceived effort
  const durationMinutes = activity.moving_time / 60;
  const sufferScore = activity.suffer_score || 50;

  // Use suffer score to estimate intensity (0-100 scale normalized)
  const intensityFactor = Math.min(1, (sufferScore / 100) + 0.3);

  return Math.round(durationMinutes * intensityFactor * 0.75);
};

// Convert Strava activity to our workout format
export const stravaActivityToWorkout = (activity) => {
  const date = activity.start_date_local.split('T')[0];
  const type = mapStravaActivityType(activity.type);
  const duration = Math.round(activity.moving_time / 60); // Convert to minutes
  const tss = calculateTSSFromActivity(activity);

  return {
    id: `strava_${activity.id}`,
    date,
    stravaId: activity.id,
    planned: {
      type,
      name: activity.name,
      description: activity.description || '',
      duration,
      tss,
    },
    completed: {
      duration,
      tss,
      avgHr: activity.average_heartrate ? Math.round(activity.average_heartrate) : null,
      notes: `Synced from Strava. Distance: ${(activity.distance / 1000).toFixed(2)}km`,
    },
  };
};
