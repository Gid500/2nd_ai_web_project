import api from '../../../common/api/api';

export const fetchUserProfile = async (userId) => {
    const response = await api.get(`/api/mypage/user/${userId}`);
    return response.data;
};

export const updateNickname = async (userId, userNickname) => {
    const response = await api.post('/api/mypage/nickname', { userId, userNickname });
    return response.data;
};

export const uploadProfileImage = async (userId, formData) => {
    const response = await api.post(`/api/mypage/profile-image/${userId}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

// 비밀번호 재설정 관련 API
export const requestPasswordResetCode = async (userEmail) => {
    const response = await api.post('/api/mypage/password-reset/request', { userEmail });
    return response.data;
};

export const confirmPasswordReset = async (userEmail, emailCode, newPassword) => {
    const response = await api.post('/api/mypage/password-reset/confirm', {
        userEmail,
        emailCode,
        newPassword,
    });
    return response.data;
};
