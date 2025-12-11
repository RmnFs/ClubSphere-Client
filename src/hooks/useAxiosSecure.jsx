import axios from 'axios';

const api = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api`,
});

// Request interceptor to add JWT token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access-token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle expired tokens
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response && error.response.status === 401) {
            // Clear expired token
            localStorage.removeItem('access-token');
            // Redirect to login
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;
