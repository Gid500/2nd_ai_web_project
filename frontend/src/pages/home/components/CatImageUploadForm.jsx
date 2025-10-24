import React, { useState, useEffect } from 'react';
import useCatImageUpload from '../hook/useCatImageUpload';
import LoadingSpinner from '../../../common/components/LoadingSpinner';

const CatImageUploadForm = () => {
    const { file, uploading, error, result, analysisData, analysisLoading, analysisError, handleFileChange, handleUpload } = useCatImageUpload();
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
        <div style={{ padding: '20px', borderRadius: '8px', maxWidth: '500px', margin: '20px auto' }}>
            <h2>고양이 이미지 업로드</h2>
            <input type="file" onChange={handleFileChange} accept="image/*" style={{ marginBottom: '10px', display: 'block' }} />
            <button onClick={handleUpload} disabled={!file || uploading} style={{
                padding: '10px 15px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                opacity: (!file || uploading) ? 0.6 : 1,
                display: 'flex', // Use flexbox for alignment
                alignItems: 'center', // Center items vertically
                justifyContent: 'center' // Center items horizontally
            }}>
                {uploading ? <><LoadingSpinner /> <span style={{ marginLeft: '8px' }}>업로드 중...</span></> : '업로드'}
            </button>

            {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
            {result && <p style={{ color: 'green', marginTop: '10px' }}>업로드 성공!</p>}

            {imagePreview && (
                <div style={{ marginTop: '20px' }}>
                    <h3>선택된 이미지:</h3>
                    <img src={imagePreview} alt="Preview" style={{ maxWidth: '100%', height: 'auto', border: '1px solid #eee' }} />
                </div>
            )}

            {result && result.predicted_emotion && result.confidence !== undefined && (
                <div style={{ marginTop: '20px' }}>
                    <h3>예측 결과:</h3>
                    <p><strong>가장 높은 감정:</strong> {result.predicted_emotion} (확신도: {(result.confidence * 100).toFixed(2)}%)</p>
                </div>
            )}

            {result && result.all_predictions && (
                <div style={{ marginTop: '20px' }}>
                    <h4>모든 감정 예측:</h4>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr>
                                <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>감정</th>
                                <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>확신도</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.entries(result.all_predictions).map(([emotion, confidence]) => (
                                <tr key={emotion}>
                                    <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>{emotion}</td>
                                    <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>{(confidence * 100).toFixed(2)}%</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {analysisLoading && (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '10px' }}>
                    <LoadingSpinner /> <span style={{ marginLeft: '8px' }}>OpenAI 분석 중...</span>
                </div>
            )}
            {analysisError && <p style={{ color: 'red', marginTop: '10px' }}>OpenAI 분석 오류: {analysisError.message}</p>}
            {analysisData && analysisData.openaiAnalysis && (
                <div style={{ marginTop: '20px' }}>
                    <h3>OpenAI 분석 결과:</h3>
                    <p>
                        {analysisData.openaiAnalysis.replace('{analysis=', '').replace('}', '')}
                    </p>
                </div>
            )}

            {file && <p style={{ marginTop: '10px' }}>선택된 파일: {file.name}</p>}
        </div>
    );
};

export default CatImageUploadForm;