import React from 'react';
import useImageUpload from '../hook/useImageUpload';

const ImageUploadForm = () => {
    const { file, uploading, error, result, handleFileChange, handleUpload } = useImageUpload();

    return (
        <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', maxWidth: '500px', margin: '20px auto' }}>
            <h2>이미지 업로드</h2>
            <input type="file" onChange={handleFileChange} accept="image/*" style={{ marginBottom: '10px', display: 'block' }} />
            <button onClick={handleUpload} disabled={!file || uploading} style={{
                padding: '10px 15px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                opacity: (!file || uploading) ? 0.6 : 1
            }}>
                {uploading ? '업로드 중...' : '업로드'}
            </button>

            {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
            {result && <p style={{ color: 'green', marginTop: '10px' }}>업로드 성공: {JSON.stringify(result)}</p>}
            {result && result.image_url && (
                <div style={{ marginTop: '20px' }}>
                    <h3>업로드된 이미지:</h3>
                    <img src={result.image_url} alt="Uploaded" style={{ maxWidth: '100%', height: 'auto', border: '1px solid #eee' }} />
                </div>
            )}
            {file && <p style={{ marginTop: '10px' }}>선택된 파일: {file.name}</p>}
        </div>
    );
};

export default ImageUploadForm;
