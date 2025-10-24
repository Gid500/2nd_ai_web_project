import { useState } from 'react';
import { uploadCatImage } from '../api/uploadApi';

const useCatImageUpload = () => {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);
    const [result, setResult] = useState(null);

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
        handleFileChange,
        handleUpload,
    };
};

export default useCatImageUpload;