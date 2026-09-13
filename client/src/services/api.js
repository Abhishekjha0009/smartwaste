import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request Interceptor: Attach Bearer JWT token if present
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('smartwaste_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle 401 token expiry
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('smartwaste_token');
      localStorage.removeItem('smartwaste_user');
    }
    return Promise.reject(error);
  }
);

export default API;
