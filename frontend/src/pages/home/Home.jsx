import React, { useState } from 'react';
import '../../asset/css/Home.css';

function Home() {
  const [image, setImage] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  return (
    <div className='home-container'>
      
      {/* 광고 배너 영역 */}
      <div className='banner-container'>
        <div className='banner'>광고 배너 1</div>
        <div className='banner'>광고 배너 2</div>
      </div>

      {/* 이미지 업로드 영역 */}
      <div className='upload-container'>
        <input 
          type='file' 
          accept='image/*' 
          onChange={handleImageUpload} 
        />
        {image && (
          <div className='preview'>
            <img src={image} alt='uploaded' />
          </div>
        )}
      </div>

      {/* 기존 콘텐츠 */}
      <div className='home-content'>
        <p>home</p>
      </div>
    </div>
  );
}

export default Home;
