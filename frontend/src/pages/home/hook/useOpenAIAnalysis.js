import { useState, useCallback } from 'react';
import { getOpenAIAnalysis } from '../api/uploadApi';

export const useOpenAIAnalysis = () => {
    const [analysisData, setAnalysisData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchAnalysis = useCallback(async (file, animalType) => {
        setLoading(true);
        setError(null);
        try {
            const data = await getOpenAIAnalysis(file, animalType);
            setAnalysisData(data);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    return { analysisData, loading, error, fetchAnalysis };
};
