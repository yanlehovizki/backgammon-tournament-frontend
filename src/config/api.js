// API Configuration
export const API_BASE_URL = 'https://77h9ikcj6vgw.manus.space/api'

export const API_ENDPOINTS = {
  TOURNAMENTS: `${API_BASE_URL}/tournaments`,
  PLAYERS: `${API_BASE_URL}/players`,
  LOGIN: `${API_BASE_URL}/auth/login`,
  REGISTER: `${API_BASE_URL}/auth/register`
}

export const apiRequest = async (url, options = {}) => {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    })
    
    const data = await response.json()
    
    return {
      success: response.ok,
      data: data,
      status: response.status
    }
  } catch (error) {
    return {
      success: false,
      error: error.message,
      status: 500
    }
  }
}