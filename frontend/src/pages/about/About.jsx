import React from 'react';
import '../../asset/css/About.css';

function About() {
    return (
        <div className="about-container">
            {/* 상단 히어로 섹션 */}
            <section className="about-hero">
                <h1>당신을 위한 맞춤형 AI 추천</h1>
                <p>REIVA는 당신의 취향과 감각을 분석해, 새로운 발견을 제안합니다.</p>
            </section>

            {/* 본문 */}
            <section className="about-content">
                <div className="about-text">
                    <h2>REIVA의 비전</h2>
                    <p>
                        REIVA는 단순한 쇼핑 플랫폼이 아닙니다.  
                        데이터를 통해 ‘당신이 좋아할 것’을 예측하고,  
                        새로운 트렌드를 자연스럽게 연결하는 AI 추천 서비스입니다.
                    </p>
                    <p>
                        수많은 데이터를 기반으로, 사용자의 선호도와 감정을 이해하며  
                        ‘나만의 스타일’을 발견할 수 있는 경험을 제공합니다.
                    </p>
                </div>

                <div className="about-image">
                    <img 
                        src="https://images.unsplash.com/photo-1677444201876-6ad479ef61f1?auto=format&fit=crop&w=800&q=80" 
                        alt="AI recommendation concept" 
                    />
                </div>
            </section>

            {/* 핵심 가치 */}
            <section className="about-values">
                <h2>우리의 핵심 가치</h2>
                <ul>
                    <li>개인화 — 당신의 취향을 중심으로 한 경험</li>
                    <li>발견 — 새로운 브랜드와 스타일을 연결</li>
                    <li>신뢰 — 데이터의 윤리적 사용과 투명성</li>
                </ul>
            </section>

            {/* 마무리 */}
            <section className="about-end">
                <p>
                    REIVA는 단순한 ‘추천 엔진’이 아닙니다.<br />
                    당신의 **취향을 이해하고, 감각을 제안하는 AI 플랫폼**입니다.<br /><br />
                    <strong>지금, 새로운 발견을 시작해보세요.</strong>
                </p>
            </section>
        </div>
    );
}

export default About;
