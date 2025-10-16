import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Cropper from 'react-easy-crop';
import getCroppedImg from './cropImage'; // 같은 폴더에서 불러오기
import '../../asset/css/Home.css';

function Home() {
  const { type } = useParams();
  const [image, setImage] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [result, setResult] = useState('');

  useEffect(() => {
    setImage(null);
    setCroppedImage(null);
    setResult('');
  }, [type]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setImage(URL.createObjectURL(file));
  };

  const onCropComplete = (croppedArea, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  };

  const handleCropConfirm = async () => {
    try {
      const cropped = await getCroppedImg(image, croppedAreaPixels);
      setCroppedImage(cropped);
      setImage(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemove = () => {
    setImage(null);
    setCroppedImage(null);
    setResult('');
  };

  const handleAIQuery = () => {
    if (!croppedImage) return alert('이미지를 업로드 후 확인해주세요.');
    setResult(`AI 분석 결과: ${type} 카테고리 이미지 분석 완료`);
  };

  return (
    <div className="home-container">
      {/* 광고 배너 */}
      <div className="home-banner-container">
        <div className="home-banner">광고 배너 1</div>
        <div className="home-banner">광고 배너 2</div>
      </div>

      {/* 업로드 + 안내 */}
      <div className="home-box">
        <div className="home-guide">
          <h2>{type === 'top' ? '상의' : type === 'bottom' ? '하의' : '원피스'}</h2>
          <h3>사진 업로드 가이드</h3>
          <p>
            1. 이미지를 선택해주세요.<br />
            2. 드래그로 원하는 영역 선택 후 "확인" 클릭.<br />
            3. 선택 영역이 AI 분석에 사용됩니다.<br />
            4. "AI 조회" 클릭.
          </p>
        </div>

        <div className="home-upload">
          {!croppedImage && (
            <>
              {image ? (
                <>
                  {/* Cropper 영역 */}
                  <div className="cropper-container">
                    <Cropper
                      image={image}
                      crop={crop}
                      zoom={zoom}
                      aspect={1}
                      onCropChange={setCrop}
                      onZoomChange={setZoom}
                      onCropComplete={onCropComplete}
                    />
                    {/* 취소 버튼 - 사진 오른쪽 위 */}
                    <button className="remove-btn" onClick={handleRemove}>취소</button>
                  </div>
                  {/* 확인 버튼 - Cropper 아래 */}
                  <div className="btn-group">
                    <button className="upload-btn" onClick={handleCropConfirm}>확인</button>
                  </div>
                </>
              ) : (
                <>
                  <input type="file" id="file-upload" accept="image/*" onChange={handleFileChange} />
                  <label htmlFor="file-upload" className="upload-btn">이미지 업로드</label>
                </>
              )}
            </>
          )}

          {croppedImage && (
            <>
              <div className="home-preview">
                <img src={croppedImage} alt="cropped" />
                {/* 초기화 버튼 - 사진 오른쪽 위 */}
                <button className="remove-btn" onClick={handleRemove}>초기화</button>
              </div>
              {/* AI 조회 버튼 - 사진 아래 */}
              <div className="btn-group">
                <button className="ai-btn" onClick={handleAIQuery}>AI 조회</button>
              </div>
            </>
          )}
        </div>
      </div>

      {result && <div className="home-ai-result">{result}</div>}
      <div className="home-content"><p>추가 콘텐츠 영역</p></div>
    </div>
  );
}

export default Home;
