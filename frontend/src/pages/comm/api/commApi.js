import api from '../../../common/api/api';

export const getAllPosts = async () => {
    try {
        const response = await api.get('/posts');
        return response.data;
    } catch (error) {
        console.error('Error fetching posts:', error);
        throw error;
    }
};

export const getPostById = async (postId) => {
    try {
        const response = await api.get(`/posts/${postId}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching post with ID ${postId}:`, error);
        throw error;
    }
};

export const createPost = async (postData) => {
    try {
        const response = await api.post('/posts/create', postData);
        return response.data;
    } catch (error) {
        console.error('Error creating post:', error);
        throw error;
    }
};

export const updatePost = async (postId, postData) => {
    try {
        const response = await api.post(`/posts/update/${postId}`, postData);
        return response.data;
    } catch (error) {
        console.error(`Error updating post with ID ${postId}:`, error);
        throw error;
    }
};

export const deletePost = async (postId) => {
    try {
        const response = await api.post(`/posts/delete/${postId}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting post with ID ${postId}:`, error);
        throw error;
    }
};
