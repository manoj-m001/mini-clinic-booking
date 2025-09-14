import axios from 'axios';

// Set base URL for all API requests
axios.defaults.baseURL = 'http://localhost:5000';

axios.interceptors.request.use(
  config => {
    const user = localStorage.getItem('user');
    
    if (user) {
      const { token } = JSON.parse(user);
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  error => Promise.reject(error)
);

axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axios;