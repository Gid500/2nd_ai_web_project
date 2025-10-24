import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/flask'; // Spring Boot backend URL

export const uploadCatImage = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await axios.post(`${API_BASE_URL}/uploadCatImage`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error uploading cat image:', error);
        throw error;
    }
};

export const uploadDogImage = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await axios.post(`${API_BASE_URL}/uploadDogImage`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error uploading dog image:', error);
        throw error;
    }
};