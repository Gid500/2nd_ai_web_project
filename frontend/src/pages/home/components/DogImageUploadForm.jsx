import React, { useState, useEffect } from 'react';
import useDogImageUpload from '../hook/useDogImageUpload';
import LoadingSpinner from '../../../common/components/LoadingSpinner';
import './DogImageUploadForm.css'; // Import the CSS file

const DogImageUploadForm = () => {
    const { file, uploading, error, result, analysisData, analysisLoading, analysisError, handleFileChange, handleUpload } = useDogImageUpload();
    const [imagePreview, setImagePreview] = useState(null);

    useEffect(() => {
        if (file) {
            const objectUrl = URL.createObjectURL(file);
            setImagePreview(objectUrl);

            return () => URL.revokeObjectURL(objectUrl);
        }
        setImagePreview(null);
    });

    return (
        <div className="dog-image-upload-form">
            <h2>강아지 이미지 업로드</h2>
            <input type="file" onChange={handleFileChange} accept="image/*" className="dog-image-upload-form-file-input" />
            <button onClick={handleUpload} disabled={!file || uploading} className="dog-image-upload-form-upload-button">
                {uploading ? <><LoadingSpinner /> <span className="dog-image-upload-form-upload-button-text">업로드 중...</span></> : '업로드'}
            </button>

            {error && <p className="dog-image-upload-form-error-message">{error}</p>}
            {result && <p className="dog-image-upload-form-success-message">업로드 성공!</p>}

            {imagePreview && (
                <div className="dog-image-upload-form-image-preview-container">
                    <h3>선택된 이미지:</h3>
                    <img src={imagePreview} alt="Preview" className="dog-image-upload-form-image-preview" />
                </div>
            )}

            {result && result.predicted_emotion && result.confidence !== undefined && (
                <div className="dog-image-upload-form-prediction-results">
                    <h3>예측 결과:</h3>
                    <p><strong>가장 높은 감정:</strong> {result.predicted_emotion} (확신도: {(result.confidence * 100).toFixed(2)}%)</p>
                </div>
            )}

            {result && result.all_predictions && (
                <div className="dog-image-upload-form-prediction-results">
                    <h4>모든 감정 예측:</h4>
                    <table className="dog-image-upload-form-all-predictions-table">
                        <thead>
                            <tr>
                                <th className="dog-image-upload-form-table-header">감정</th>
                                <th className="dog-image-upload-form-table-header">확신도</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.entries(result.all_predictions).map(([emotion, confidence]) => (
                                <tr key={emotion}>
                                    <td className="dog-image-upload-form-table-data">{emotion}</td>
                                    <td className="dog-image-upload-form-table-data">{(confidence * 100).toFixed(2)}%</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {analysisLoading && (
                <div className="dog-image-upload-form-analysis-loading">
                    <LoadingSpinner /> <span className="dog-image-upload-form-analysis-loading-text">OpenAI 분석 중...</span>
                </div>
            )}
            {analysisError && <p className="dog-image-upload-form-analysis-error">OpenAI 분석 오류: {analysisError.message}</p>}
            {analysisData && analysisData.openaiAnalysis && (
                <div className="dog-image-upload-form-analysis-results">
                    <h3>OpenAI 분석 결과:</h3>
                    <p>{analysisData.openaiAnalysis.replace('{analysis=', '').replace('}', '')}</p>
                </div>
            )}

            {file && <p className="dog-image-upload-form-selected-file-info">선택된 파일: {file.name}</p>}
        </div>
    );
};

export default DogImageUploadForm;