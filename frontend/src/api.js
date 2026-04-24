import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
});

// Request interceptor to add the auth token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = token;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response interceptor for consistent error handling
API.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // If the error has a response from the server, use that message
    const message = error.response?.data?.message || 'Something went wrong';
    
    // Handle 401 Unauthorized globally (e.g., logout user if token expired)
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      // window.location.href = '/'; // Optional layout redirect
    }

    return Promise.reject({ ...error, message });
  }
);

export default API;
