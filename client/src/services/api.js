import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request Interceptor: Attach JWT Bearer token if present
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('shopsphere_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Format error responses gracefully without wiping user state
API.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response && error.response.data && error.response.data.message
        ? error.response.data.message
        : error.message || 'An unexpected network error occurred';

    // Only purge token on explicit logout path 401
    if (error.config && error.config.url && error.config.url.includes('/auth/logout')) {
      localStorage.removeItem('shopsphere_token');
      localStorage.removeItem('shopsphere_user');
    }

    return Promise.reject(new Error(message));
  }
);

export default API;
