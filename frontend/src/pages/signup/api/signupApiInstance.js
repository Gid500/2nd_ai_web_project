import axios from 'axios';

const instance = axios.create({
    baseURL: process.env.REACT_APP_BACKEND_URL || 'http://localhost:8080',
});

export default instance;
