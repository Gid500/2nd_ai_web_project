import axios from 'axios';

const API_URL = 'http://localhost:8080/api/comments'; // 백엔드 댓글 API 기본 URL

// 댓글 목록 조회
export const getCommentsByPostId = async (postId) => {
    try {
        const response = await axios.get(`${API_URL}/post/${postId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching comments:', error);
        throw error;
    }
};

// 댓글 작성
export const addComment = async (commentData, token) => {
    try {
        const response = await axios.post(API_URL, commentData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error adding comment:', error);
        throw error;
    }
};

// 댓글 수정
export const updateComment = async (commentId, commentData, token) => {
    try {
        const response = await axios.post(`${API_URL}/${commentId}`, commentData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error updating comment:', error);
        throw error;
    }
};

// 댓글 삭제
export const deleteComment = async (commentId, token) => {
    try {
        const response = await axios.post(`${API_URL}/delete/${commentId}`, {}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error deleting comment:', error);
        throw error;
    }
};