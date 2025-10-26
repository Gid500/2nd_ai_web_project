import api from '../../../common/api/api';

// 게시글 ID로 댓글 목록 조회
export const getCommentsByPostId = async (postId) => {
    try {
        const response = await api.get(`/api/comments/post/${postId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching comments:', error);
        throw error;
    }
};

// 새 댓글 추가
export const addComment = async (commentData) => {
    try {
        const response = await api.post('/api/comments', commentData);
        return response.data;
    } catch (error) {
        console.error('Error adding comment:', error);
        throw error;
    }
};

// 댓글 수정
export const updateComment = async (commentId, commentData) => {
    try {
        const response = await api.post(`/api/comments/${commentId}`, commentData);
        return response.data;
    } catch (error) {
        console.error('Error updating comment:', error);
        throw error;
    }
};

// 댓글 삭제
export const deleteComment = async (commentId) => {
    try {
        const response = await api.post(`/api/comments/delete/${commentId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting comment:', error);
        throw error;
    }
};
