import api from '../../../common/api/api'; // api 인스턴스 임포트

export const getAllComments = async (page = 1, size = 10) => {
    try {
        const response = await api.get(`/api/comments/admin/all?page=${page}&size=${size}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching all comments:", error);
        throw error;
    }
};

export const adminDeleteComment = async (commentId) => {
    try {
        const response = await api.post(`/api/comments/delete/${commentId}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting comment ${commentId}:`, error);
        throw error;
    }
};
