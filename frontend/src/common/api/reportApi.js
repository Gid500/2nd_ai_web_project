import api from './api';

export const getAllReports = async (page = 1, limit = 10) => {
    try {
        const response = await api.get(`/api/report?page=${page}&limit=${limit}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching all reports:", error);
        throw error;
    }
};

export const deleteReport = async (reportId) => {
    try {
        const response = await api.post(`/api/report/delete/${reportId}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting report ${reportId}:`, error);
        throw error;
    }
};
