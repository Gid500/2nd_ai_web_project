import api from './api';

export const fetchCurrentUser = async () => {
    try {
        const response = await api.get('/api/user/me');
        return response.data;
    } catch (error) {
        console.error("Error fetching current user:", error);
        // If 401 or 403, it means no authenticated user, which is fine.
        // Just return a default loggedOut state.
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            return { loggedIn: false };
        }
        throw error;
    }
};

export const logoutUser = async () => {
    try {
        // Backend will clear the HttpOnly cookie
        const response = await api.post('/api/logout'); // Assuming a /api/logout endpoint to clear cookie
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const deleteUser = async (userId) => {
    try {
        const response = await api.delete(`/api/user/${userId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const adminDeleteUser = async (userId) => {
    try {
        const response = await api.delete(`/api/user/${userId}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting user with ID ${userId}:`, error);
        throw error;
    }
};

export const getAllUsers = async (page = 1, limit = 10) => {
    try {
        const response = await api.get(`/api/user/all?page=${page}&limit=${limit}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching all users:", error);
        throw error;
    }
};

export const sendVerificationEmail = async (userEmail) => {
    try {
        const response = await api.post('/api/email/send-verification', { email: userEmail });
        return response.data;
    } catch (error) {
        console.error("Error sending verification email:", error);
        throw error;
    }
};

export const verifyEmailCode = async (userEmail, code) => {
    try {
        const response = await api.post('/api/email/verify-code', { userEmail, code });
        return response.data;
    } catch (error) {
        console.error("Error verifying email code:", error);
        throw error;
    }
};

