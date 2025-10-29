import React, { useEffect, useState } from 'react'; // Add useEffect, useState
import { useNavigate, useLocation } from 'react-router-dom'; // Add useLocation
import PostForm from './components/PostForm';
import useCommPage from './hook/useCommPage';
import LoadingSpinner from '../../common/components/LoadingSpinner';
import './Comm.css'; // Comm.css를 가져와서 스타일을 공유합니다.

function NewPostPage() {
    const navigate = useNavigate();
    const location = useLocation(); // Initialize useLocation
    const [initialPostData, setInitialPostData] = useState({}); // State for initial post data

    const {
        handleSubmitForm,
        handleCancelForm,
        loading,
        error,
    } = useCommPage(); // useCommPage 훅을 사용하여 폼 제출 및 취소 로직을 가져옵니다.

    useEffect(() => {
        if (location.state) {
            const { animalType, predictionResult, openaiAnalysis, imageUrl } = location.state;
            let title = '';
            let content = '';

            if (animalType === 'dog') {
                title = `강아지 감정 분석 결과 공유: ${predictionResult?.predicted_emotion || ''}`;
            } else if (animalType === 'cat') {
                title = `고양이 감정 분석 결과 공유: ${predictionResult?.predicted_emotion || ''}`;
            }

            content += `[예측 결과]\n가장 높은 감정: ${predictionResult?.predicted_emotion || 'N/A'} (확신도: ${(predictionResult?.confidence * 100).toFixed(2) || 'N/A'}%)\n`;
            if (predictionResult?.all_predictions) {
                content += '모든 감정 예측:\n';
                Object.entries(predictionResult.all_predictions).forEach(([emotion, confidence]) => {
                    content += `- ${emotion}: ${(confidence * 100).toFixed(2)}%\n`;
                });
            }
            content += `\n[OpenAI 분석 결과]\n${openaiAnalysis || 'N/A'}\n`;

            setInitialPostData({ postTitle: title, postContent: content });
        }
    }, [location.state]);

    if (loading) return (
        <div className="comm-loading-spinner-container">
            <LoadingSpinner />
        </div>
    );
    if (error) return <p>에러 발생: {error.message}</p>;

    const handleFormSubmit = async (formData) => {
        await handleSubmitForm(formData);
        navigate('/comm'); // 제출 후 목록 페이지로 이동
    };

    const handleFormCancel = () => {
        handleCancelForm();
        navigate('/comm'); // 취소 후 목록 페이지로 이동
    };

    return (
        <div className="comm-container">
            <h1 className="comm-header">새 게시글 작성</h1>
            <PostForm
                onSubmit={handleFormSubmit}
                onCancel={handleFormCancel}
                initialData={initialPostData} // Use initialPostData
            />
        </div>
    );
}

export default NewPostPage;
