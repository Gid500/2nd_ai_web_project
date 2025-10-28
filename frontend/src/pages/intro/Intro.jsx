import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './intro.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

function Intro() {
  const navigate = useNavigate();
  const [catHover, setCatHover] = useState(false);
  const [dogHover, setDogHover] = useState(false);

  return (
    <div className="intro-container">
        <div
          className="cat"
          onClick={() => navigate('/cat')}
          onMouseEnter={() => setCatHover(true)}
          onMouseLeave={() => setCatHover(false)}
        >
          <img
            src={catHover ? '/angrycat.png' : '/sleepcat.png'}  // public/에 파일 존재해야 함
            alt="cat"
            className="cat-img"
          />
            <div className='cat_text'>
              <p>우리 냐옹이는 어떤생각해?</p>
            </div>
          
        </div>
        <div
          className="cat"
          onClick={() => navigate('/dog')}
          onMouseEnter={() => setDogHover(true)}
          onMouseLeave={() => setDogHover(false)}
        >
          <img
            src={dogHover ? '/interdog.png' : '/saddog.png'}  // public/에 파일 존재해야 함
            alt="dog"
            className="dog-img"
          />
            <div className='cat_text'>
              <p>우리 멍멍이는 어떤생각해?</p>
            </div>
          
        </div>

    </div>
  );
}

export default Intro;
