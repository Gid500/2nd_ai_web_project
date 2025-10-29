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

export const updateReportStatus = async (reportId, reportStatus) => {
    try {
        const response = await api.put(`/api/report/${reportId}/status`, { reportStatus });
        return response.data;
    } catch (error) {
        console.error(`Error updating report status ${reportId}:`, error);
        throw error;
    }
};

