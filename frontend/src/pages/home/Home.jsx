import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../../asset/css/Home.css';

function Home() {
  const { type } = useParams();
  const [image, setImage] = useState(null);
  const [result, setResult] = useState('');

  // 카테고리 변경 시 이미지와 결과 초기화
  useEffect(() => {
    setImage(null);
    setResult('');
  }, [type]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      setResult('');
    }
  };

  const handleAIQuery = () => {
    if (!image) return alert('먼저 이미지를 업로드해주세요.');
    setResult(`AI 분석 결과: ${type} 카테고리 이미지 분석 완료`);
  };

  const handleRemoveImage = () => {
    setImage(null);
    setResult('');
  };

  return (
    <div className='home-container'>

      {/* 광고 배너 */}
      <div className='home-banner-container'>
        <div className='home-banner'>광고 배너 1</div>
        <div className='home-banner'>광고 배너 2</div>
      </div>

      {/* 업로드 + 안내 박스 */}
      <div className='home-box'>

        {/* 안내 영역 */}
        <div className='home-guide'>
          <h2>{type === 'top' ? '상의' : type === 'bottom' ? '하의' : '원피스'}</h2>
          <h3>사진 업로드 가이드</h3>
          <p>
            1. 이미지를 선택해주세요.<br />
            2. 얼굴이나 제품이 잘 보이도록 사진을 자르세요.<br />
            3. 배경은 단순하게 유지하면 AI 분석 정확도가 높아집니다.<br />
            4. 업로드 후 "AI 조회" 버튼을 클릭하세요.
          </p>
        </div>

        {/* 업로드 영역 */}
        <div className='home-upload'>
          <input 
            type='file' 
            id='file-upload' 
            accept='image/*' 
            onChange={handleImageUpload} 
          />
          <label htmlFor='file-upload' className='upload-btn'>이미지 업로드</label>

          {/* 이미지 업로드 시에만 미리보기 + 버튼 표시 */}
          {image && (
            <>
              <div className='home-preview'>
                <img src={image} alt='uploaded' />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button className='ai-btn' onClick={handleAIQuery}>AI 조회</button>
                <button className='remove-btn' onClick={handleRemoveImage}>취소</button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* AI 결과 */}
      {result && <div className='home-ai-result'>{result}</div>}

      {/* 추가 콘텐츠 */}
      <div className='home-content'>
        <p>추가 콘텐츠 영역</p>
      </div>
    </div>
  );
}

export default Home;
