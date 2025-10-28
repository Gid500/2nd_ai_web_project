import { useState } from 'react';
import { uploadCatImage } from '../api/uploadApi';
import { useOpenAIAnalysis } from './useOpenAIAnalysis';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const useCatImageUpload = () => {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);
    const [result, setResult] = useState(null);
    const navigate = useNavigate(); // Initialize useNavigate

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

    const handleSharePost = () => {
        if (result || analysisData) {
            navigate('/comm/new', {
                state: {
                    animalType: 'cat',
                    predictionResult: result,
                    openaiAnalysis: analysisData?.openaiAnalysis,
                    imageUrl: result?.imageUrl // Assuming result contains imageUrl
                }
            });
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
        handleSharePost, // Add handleSharePost to the returned object
    };
};

export default useCatImageUpload;