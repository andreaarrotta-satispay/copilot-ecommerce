import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: true, // Include cookies in all requests
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor (for adding auth tokens, logging, etc.)
api.interceptors.request.use(
  (config) => {
    // You can add auth tokens, logging, or other request modifications here
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor (for error handling, token refresh, etc.)
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common errors here (e.g., 401 unauthorized, 500 server error)
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export default api;