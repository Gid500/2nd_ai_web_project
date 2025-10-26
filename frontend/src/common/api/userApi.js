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
        console.error("Error logging out user:", error);
        throw error;
    }
};
