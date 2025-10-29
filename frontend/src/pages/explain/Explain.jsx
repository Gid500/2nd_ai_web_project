import React from 'react';
import './Explain.css';

function Explain() {
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };


  return (
    <div className="explain-page">
      {/* 우측 탭 */}
    <div className="mypage-tabs">
    <button className="tab" onClick={() => scrollTo('intro1')}>헤더</button>
    <button className="tab" onClick={() => scrollTo('intro2')}>궁금해요!</button>
    <button className="tab" onClick={() => scrollTo('intro3')}>Intro 3</button>
    <button className="tab" onClick={() => scrollTo('intro4')}>Intro 4</button>
    <button className="tab" onClick={() => scrollTo('intro5')}>Intro 5</button>
    </div>
      {/* 내용 영역 */}

      <div className="explain-section" id="intro1">
        <h2>헤더</h2>
        <img src="/intro.png" alt="Intro 1" />
        <p>헤더에 대한 소개</p>
        
      </div>

      <div className="explain-section" id="intro2">
        <img src="/intro2.png" alt="Intro 2" />
        <p>이곳은 두 번째 소개입니다.</p>
      </div>

      <div className="explain-section" id="intro3">
        <img src="/intro3.png" alt="Intro 3" />
        <p>이곳은 세 번째 설명입니다.</p>
      </div>

      <div className="explain-section" id="intro4">
        <img src="/intro4.png" alt="Intro 4" />
        <p>이곳은 네 번째 소개입니다.</p>
      </div>

      <div className="explain-section" id="intro5">
        <img src="/intro5.png" alt="Intro 5" />
        <p>마지막 다섯 번째 소개입니다.</p>
      </div>
    </div>
  );
}

export default Explain;
