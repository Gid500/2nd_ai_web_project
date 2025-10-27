import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080', // Your backend URL
    withCredentials: true, // Important for sending cookies
});

// Add a request interceptor to include the JWT token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token'); // 또는 쿠키에서 가져오기
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
