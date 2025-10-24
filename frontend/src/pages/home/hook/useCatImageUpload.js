import { useState } from 'react';
import { uploadCatImage } from '../api/uploadApi';
import { useOpenAIAnalysis } from './useOpenAIAnalysis';

const useCatImageUpload = () => {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);
    const [result, setResult] = useState(null);

    const { analysisData, loading: analysisLoading, error: analysisError, fetchAnalysis } = useOpenAIAnalysis();

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
        setError(null);
        setResult(null);
    };

    const handleUpload = async () => {
        if (!file) {
            setError('파일을 선택해주세요.');
            return;
        }

        setUploading(true);
        setError(null);
        setResult(null);

        try {
            const response = await uploadCatImage(file);
            setResult(response);
            // Fetch OpenAI analysis after successful image upload
            await fetchAnalysis(file, "cat");
        } catch (err) {
            setError('업로드 실패: ' + (err.response?.data || err.message));
        } finally {
            setUploading(false);
        }
    };

    return {
        file,
        uploading,
        error,
        result,
        analysisData,
        analysisLoading,
        analysisError,
        handleFileChange,
        handleUpload,
    };
};

export default useCatImageUpload;