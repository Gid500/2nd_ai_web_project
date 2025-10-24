import { useState } from 'react';
import { uploadDogImage } from '../api/uploadApi';
import { useOpenAIAnalysis } from './useOpenAIAnalysis';

const useDogImageUpload = () => {
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
            const response = await uploadDogImage(file);
            setResult(response);
            // Fetch OpenAI analysis after successful image upload
            await fetchAnalysis(file, "dog");
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

export default useDogImageUpload;