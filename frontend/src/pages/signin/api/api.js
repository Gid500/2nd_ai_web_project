import axios from 'axios';

const instance = axios.create({
    baseURL: process.env.REACT_APP_BACKEND_URL || 'http://localhost:8080',
    withCredentials: true, // 세션 유지를 위해 필요
});

export default instance;