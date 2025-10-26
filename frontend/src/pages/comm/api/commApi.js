import api from '../../../common/api/api';

export const getAllPosts = async (page = 1, size = 10) => {
    try {
        const response = await api.get(`/api/posts?page=${page}&size=${size}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching posts:', error);
        throw error;
    }
};

export const getPostById = async (postId) => {
    try {
        const response = await api.get(`/api/posts/${postId}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching post with ID ${postId}:`, error);
        throw error;
    }
};

export const createPost = async (postData) => {
    try {
        const response = await api.post('/api/posts/create', postData);
        return response.data;
    } catch (error) {
        console.error('Error creating post:', error);
        throw error;
    }
};

export const updatePost = async (postId, postData) => { // POST 요청으로 변경
    try {
        // 백엔드에서 postId를 postData 내에서 처리하므로 URL에서 제거
        const response = await api.post(`/api/posts/update`, postData);
        return response.data;
    } catch (error) {
        console.error(`Error updating post with ID ${postId}:`, error);
        throw error;
    }
};

export const deletePost = async (postId) => {
    try {
        const response = await api.delete(`/api/posts/delete/${postId}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting post with ID ${postId}:`, error);
        throw error;
    }
};
