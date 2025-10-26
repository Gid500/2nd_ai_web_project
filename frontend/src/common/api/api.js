import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080', // Your backend URL
    withCredentials: true, // Important for sending cookies
});

// Removed interceptor that adds Authorization header

export default api;
