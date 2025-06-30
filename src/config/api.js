// API configuration utility
// This file manages API endpoints based on environment

const getApiBaseUrl = () => {
  // Check for environment variable first
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  
  // Fallback based on environment
  if (import.meta.env.DEV) {
    // Development environment
    return 'http://localhost:5000';
  } else {
    // Production environment - using the existing backend URL
    return 'http://tournament.backgammonconnection.com';
  }
};

export const API_BASE_URL = getApiBaseUrl();

// API endpoints configuration
export const API_ENDPOINTS = {
  // Player endpoints
  PLAYER_REGISTER: `${API_BASE_URL}/api/players/register`,
  PLAYER_LOGIN: `${API_BASE_URL}/api/players/login`,
  PLAYER_LOGOUT: `${API_BASE_URL}/api/players/logout`,
  PLAYER_PROFILE: (playerId) => `${API_BASE_URL}/api/players/${playerId}`,
  PLAYER_TOURNAMENTS: (playerId) => `${API_BASE_URL}/api/players/${playerId}/tournaments`,
  
  // Tournament endpoints
  TOURNAMENTS: `${API_BASE_URL}/api/tournaments`,
  TOURNAMENT_DETAIL: (tournamentId) => `${API_BASE_URL}/api/tournaments/${tournamentId}`,
  TOURNAMENT_ENROLL: (tournamentId) => `${API_BASE_URL}/api/tournaments/${tournamentId}/enroll`,
  TOURNAMENT_UNENROLL: (tournamentId) => `${API_BASE_URL}/api/tournaments/${tournamentId}/unenroll`,
  TOURNAMENT_START: (tournamentId) => `${API_BASE_URL}/api/tournaments/${tournamentId}/start`,
  TOURNAMENT_MATCHES: (tournamentId) => `${API_BASE_URL}/api/tournaments/${tournamentId}/matches`,
  TOURNAMENT_UPDATE_BRACKET: (tournamentId) => `${API_BASE_URL}/api/tournaments/${tournamentId}/bracket`,
  
  // Match endpoints
  MATCH_RESULT: (matchId) => `${API_BASE_URL}/api/matches/${matchId}/result`,
  MATCH_START: (matchId) => `${API_BASE_URL}/api/matches/${matchId}/start`,
};

// API configuration
export const API_CONFIG = {
  timeout: parseInt(import.meta.env.VITE_API_TIMEOUT) || 30000,
  retryAttempts: parseInt(import.meta.env.VITE_API_RETRY_ATTEMPTS) || 3,
  headers: {
    'Content-Type': 'application/json',
  }
};

// Utility function for making API requests with error handling
export const apiRequest = async (url, options = {}) => {
  const config = {
    ...API_CONFIG.headers,
    ...options.headers,
  };

  const requestOptions = {
    ...options,
    headers: config,
  };

  try {
    const response = await fetch(url, requestOptions);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('API request failed:', error);
    return { success: false, error: error.message };
  }
};

