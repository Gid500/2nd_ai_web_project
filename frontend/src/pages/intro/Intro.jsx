import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './intro.css';

function Intro() {
  const navigate = useNavigate();
  const [hover, setHover] = useState(false);

  return (
    <div
      className="cat"
      onClick={() => navigate('/home')}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <img
        src={hover ? '/angrycat.png' : '/sleepcat.png'}  // public/에 파일 존재해야 함
        alt="cat"
        className="cat-img"
      />
        <div className='cat_text'>
          <p>우리 냐옹이는 어떤생각해?</p>
        </div>
      
    </div>
  );
}

export default Intro;
