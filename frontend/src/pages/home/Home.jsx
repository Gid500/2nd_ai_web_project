import React, { useState, useCallback, useEffect } from 'react';
import Cropper from 'react-easy-crop';
import getCroppedImg from './cropImage'; // 캔버스 기반 크롭 함수
import '../../asset/css/Home.css';
import { Camera, RefreshCcw, Check, UploadCloud, X } from 'lucide-react';

const defaultCropArea = { x: 0, y: 0, width: 250, height: 250 };
const CATEGORY_MAP = { top: '상의', bottom: '하의', onepiece: '원피스' };

function Home() {
  // ====================== 상태 정의 ======================
  const [type, setType] = useState('top');
  const [image, setImage] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(defaultCropArea);
  const [result, setResult] = useState('');
  const [keywords, setKeywords] = useState([]);
  const [message, setMessage] = useState('');

  const categoryName = CATEGORY_MAP[type] || '기타';

  // ====================== 이미지 업로드 ======================
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (image) URL.revokeObjectURL(image);
      if (croppedImage) URL.revokeObjectURL(croppedImage);
      setImage(URL.createObjectURL(file));
      setCroppedImage(null);
      setResult('');
      setKeywords([]);
      setMessage('');
    }
  };

  // ====================== 크롭 완료 ======================
  const onCropComplete = useCallback((_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleCropConfirm = async () => {
    if (!image) {
      setMessage('이미지를 업로드해주세요.');
      return;
    }
    setMessage('이미지 자르는 중...');
    try {
      const cropped = await getCroppedImg(image, croppedAreaPixels); // Blob URL 반환
      setCroppedImage(cropped);
      setMessage('이미지 자르기 완료! AI 조회를 클릭하세요.');
    } catch (err) {
      console.error(err);
      setMessage('이미지 자르기 실패');
    }
  };

  // ====================== 초기화 ======================
  const handleRemove = () => {
    if (image) URL.revokeObjectURL(image);
    if (croppedImage) URL.revokeObjectURL(croppedImage);
    setImage(null);
    setCroppedImage(null);
    setResult('');
    setKeywords([]);
    setMessage('이미지 선택이 초기화되었습니다.');
  };

  // ====================== AI 분석 ======================
  const handleAIQuery = async () => {
    if (!croppedImage) {
      setMessage('이미지를 업로드 후 확인해주세요.');
      return;
    }

    setMessage('AI 분석 요청 중...');

    try {
      // Blob URL → Base64 변환
      const toBase64 = (file) =>
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result.split(',')[1]);
          reader.onerror = (error) => reject(error);
        });

      const response = await fetch(croppedImage);
      const blob = await response.blob();
      const base64 = await toBase64(blob);

      // 백엔드 호출
      const res = await fetch('http://localhost:8080/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: base64, category: type }),
      });

      const data = await res.json();

      // GPT 응답 JSON 객체 확인
      let parsed = {};
      if (typeof data.result === 'string') {
        try {
          parsed = JSON.parse(data.result);
        } catch {
          parsed = { color: '', design: '', pattern: '', style: '', keywords: [] };
        }
      } else {
        parsed = data.result;
      }

      setKeywords(parsed.keywords || []);
      setResult(
        `색상: ${parsed.color || '-'}, 디자인: ${parsed.design || '-'}, 패턴: ${parsed.pattern || '-'}, 스타일: ${parsed.style || '-'}`
      );
      setMessage('AI 분석 완료!');
    } catch (err) {
      console.error(err);
      setMessage('AI 분석 실패');
    }
  };

  // ====================== 메시지 박스 ======================
  const MessageBox = ({ text }) => {
    if (!text) return null;
    return <div className="home-message">{text}</div>;
  };

  // ====================== UI ======================
  return (
    <div className="home-container">
      <MessageBox text={message} />

      <div className="home-banner-container">
        <div className="home-banner">오늘의 스타일 추천 광고</div>
        <div className="home-banner">AI 코디네이터 프로모션</div>
      </div>

      <div className="home-box">
        <div className="home-guide">
          <h2>{categoryName} 분석</h2>
          <h3>사진 업로드 가이드</h3>
          <p>
            1. 이미지를 선택해주세요.<br />
            2. 중앙 사각형 영역 선택 후 "확인" 클릭.<br />
            3. 선택 영역이 AI 분석에 사용됩니다.<br />
            4. "AI 조회" 클릭.
          </p>
        </div>

        <div className="home-upload">
          {!croppedImage ? (
            image ? (
              <>
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
                  <button className="remove-btn" onClick={handleRemove}>
                    <X /> 취소
                  </button>
                </div>
                <div className="btn-group">
                  <button className="upload-btn" onClick={handleCropConfirm}>
                    <Check /> 확인
                  </button>
                </div>
              </>
            ) : (
              <>
                <input type="file" id="file-upload" accept="image/*" onChange={handleFileChange} className="hidden" />
                <label htmlFor="file-upload" className="upload-btn">
                  <UploadCloud /> 이미지 업로드
                </label>
              </>
            )
          ) : (
            <>
              <div className="home-preview">
                <img src={croppedImage} alt="cropped" />
                <button className="remove-btn" onClick={handleRemove}>
                  <RefreshCcw /> 초기화
                </button>
              </div>
              <div className="btn-group">
                <button className="ai-btn" onClick={handleAIQuery}>
                  <Camera /> AI 조회
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {result && (
        <div className="home-ai-result">
          <p>{result}</p>
          {keywords.length > 0 && (
            <div className="home-keywords">
              {keywords.map((k, i) => (
                <span key={i} className="keyword-tag">{k}</span>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="home-content">
        <p>추가 콘텐츠 및 관련 상품 추천 영역</p>
      </div>
    </div>
  );
}

export default Home;
