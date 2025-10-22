import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/upload-image'; // 백엔드 서버 URL

export const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await axios.post(API_BASE_URL, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error uploading image:', error);
        throw error;
    }
};
