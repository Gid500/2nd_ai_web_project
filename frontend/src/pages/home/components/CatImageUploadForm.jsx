import React, { useState, useEffect } from 'react';
import useCatImageUpload from '../hook/useCatImageUpload';
import LoadingSpinner from '../../../common/components/LoadingSpinner';
import './CatImageUploadForm.css'; // Import the CSS file

const CatImageUploadForm = () => {
    const { file, uploading, error, result, analysisData, analysisLoading, analysisError, handleFileChange, handleUpload, handleSharePost } = useCatImageUpload(); // Add handleSharePost
    const [imagePreview, setImagePreview] = useState(null);

    useEffect(() => {
        if (file) {
            const objectUrl = URL.createObjectURL(file);
            setImagePreview(objectUrl);

            return () => URL.revokeObjectURL(objectUrl);
        }
        setImagePreview(null);
    }, [file]);

    return (
        <div className="cat-image-upload-form"> {/* Replaced style with className */} 
            <h2>고양이 이미지 업로드</h2>
            <input type="file" onChange={handleFileChange} accept="image/*" className="cat-image-upload-form-file-input" /> {/* Replaced style with className */} 
            <button onClick={handleUpload} disabled={!file || uploading} className="cat-image-upload-form-upload-button"> {/* Replaced style with className */} 
                {uploading ? <><LoadingSpinner /> <span className="cat-image-upload-form-upload-button-text">업로드 중...</span></> : '업로드'}
            </button>

            {error && <p className="cat-image-upload-form-error-message">{error}</p>} {/* Replaced style with className */} 
            {result && <p className="cat-image-upload-form-success-message">업로드 성공!</p>} {/* Replaced style with className */} 

            {imagePreview && (
                <div className="cat-image-upload-form-image-preview-container"> {/* Replaced style with className */} 
                    <h3>선택된 이미지:</h3>
                    <img src={imagePreview} alt="Preview" className="cat-image-upload-form-image-preview" /> {/* Replaced style with className */} 
                </div>
            )}

            {result && result.predicted_emotion && result.confidence !== undefined && (
                <div className="cat-image-upload-form-prediction-results"> {/* Replaced style with className */} 
                    <h3>예측 결과:</h3>
                    <p><strong>가장 높은 감정:</strong> {result.predicted_emotion} (확신도: {(result.confidence * 100).toFixed(2)}%)</p>
                </div>
            )}

            {result && result.all_predictions && (
                <div className="cat-image-upload-form-prediction-results"> {/* Replaced style with className */} 
                    <h4>모든 감정 예측:</h4>
                    <table className="cat-image-upload-form-all-predictions-table"> {/* Replaced style with className */} 
                        <thead>
                            <tr>
                                <th className="cat-image-upload-form-table-header">감정</th> {/* Replaced style with className */} 
                                <th className="cat-image-upload-form-table-header">확신도</th> {/* Replaced style with className */} 
                            </tr>
                        </thead>
                        <tbody>
                            {Object.entries(result.all_predictions).map(([emotion, confidence]) => (
                                <tr key={emotion}>
                                    <td className="cat-image-upload-form-table-data">{emotion}</td> {/* Replaced style with className */} 
                                    <td className="cat-image-upload-form-table-data">{(confidence * 100).toFixed(2)}%</td> {/* Replaced style with className */} 
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {analysisLoading && (
                <div className="cat-image-upload-form-analysis-loading"> {/* Replaced style with className */} 
                    <LoadingSpinner /> <span className="cat-image-upload-form-analysis-loading-text">OpenAI 분석 중...</span>
                </div>
            )}
            {analysisError && <p className="cat-image-upload-form-analysis-error">OpenAI 분석 오류: {analysisError.message}</p>} {/* Replaced style with className */} 
            {analysisData && analysisData.openaiAnalysis && (
                <div className="cat-image-upload-form-analysis-results"> {/* Replaced style with className */} 
                    <h3>OpenAI 분석 결과:</h3>
                    <p>
                        {analysisData.openaiAnalysis.replace('{analysis=', '').replace('}', '')}
                    </p>
                </div>
            )}

            {(result || analysisData) && ( // Render share button if there's any result or analysis data
                <button onClick={handleSharePost} className="cat-image-upload-form-share-button">
                    게시물 공유
                </button>
            )}

            {file && <p className="cat-image-upload-form-selected-file-info">선택된 파일: {file.name}</p>} {/* Replaced style with className */} 
        </div>
    );
};

export default CatImageUploadForm;