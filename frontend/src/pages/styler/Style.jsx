import React, { useState, useRef } from 'react';
import '../../asset/css/Style.css';

function Style() {
  const [topImage, setTopImage] = useState(null);
  const [bottomImage, setBottomImage] = useState(null);
  const fileInputTop = useRef(null);
  const fileInputBottom = useRef(null);
  const [result, setResult] = useState('');

  const handleImageUpload = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      if (type === 'top') setTopImage(url);
      else setBottomImage(url);
    }
  };

  const handleRemoveImage = (type) => {
    if (type === 'top') {
      setTopImage(null);
      if (fileInputTop.current) fileInputTop.current.value = null;
    } else {
      setBottomImage(null);
      if (fileInputBottom.current) fileInputBottom.current.value = null;
    }
  };

  const handleRecommend = () => {
    if (!topImage || !bottomImage) {
      setResult('상의와 하의를 모두 업로드해주세요 👕👖');
      return;
    }
    setResult('AI가 업로드된 상의와 하의를 분석하여 추천을 생성했습니다! 🌈');
  };

  return (
    <div className="style-container">
      {/* 광고 배너 */}
      <div className="style-banner-container">
        <div className="style-banner">광고 배너 1</div>
        <div className="style-banner">광고 배너 2</div>
      </div>

      {/* 추천 박스 */}
      <div className="style-box">
        {/* 왼쪽 안내 */}
        <div className="style-guide">
          <h2>AI 스타일 추천</h2>
          <h3>상의/하의 사진 업로드</h3>
          <p>
            상의와 하의 사진을 업로드하면,<br />
            AI가 조합, 계절별 색감, 밸런스를 분석해 추천해줍니다.<br />
            이미지 안 잘림, 고정 크기 칸 유지 ✔
          </p>
        </div>

        {/* 오른쪽 업로드 */}
        <div className="style-upload">
          {/* 상의 업로드 */}
          <div className="style-upload-section">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e, 'top')}
              ref={fileInputTop}
              id="top-upload"
            />
            <label className="upload-btn" htmlFor="top-upload">상의 업로드</label>

            <div className="style-preview" style={{ minHeight: '200px', maxHeight: '250px', position: 'relative' }}>
              {topImage ? (
                <>
                  <img src={topImage} alt="top" style={{ objectFit: 'contain', maxHeight: '100%' }} />
                  {/* 취소 버튼 - 이미지 오른쪽 위 */}
                  <button className="remove-btn" onClick={() => handleRemoveImage('top')}>취소</button>
                </>
              ) : (
                <span>상의 사진을 업로드하세요</span>
              )}
            </div>
          </div>

          {/* 하의 업로드 */}
          <div className="style-upload-section">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e, 'bottom')}
              ref={fileInputBottom}
              id="bottom-upload"
            />
            <label className="upload-btn" htmlFor="bottom-upload">하의 업로드</label>

            <div className="style-preview" style={{ minHeight: '200px', maxHeight: '250px', position: 'relative' }}>
              {bottomImage ? (
                <>
                  <img src={bottomImage} alt="bottom" style={{ objectFit: 'contain', maxHeight: '100%' }} />
                  {/* 취소 버튼 - 이미지 오른쪽 위 */}
                  <button className="remove-btn" onClick={() => handleRemoveImage('bottom')}>취소</button>
                </>
              ) : (
                <span>하의 사진을 업로드하세요</span>
              )}
            </div>
          </div>

          {/* 추천 버튼 - 이미지 아래 */}
          <div className="btn-group">
            <button className="style-btn" onClick={handleRecommend}>추천 받기</button>
          </div>

          {/* 결과 표시 */}
          {result && <div className="style-result">{result}</div>}
        </div>
      </div>

      <div className="style-content">
        <p>패션 AI가 업로드된 상의/하의를 분석하고 있습니다...</p>
      </div>
    </div>
  );
}

export default Style;
