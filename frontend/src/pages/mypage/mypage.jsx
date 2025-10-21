// src/pages/mypage/MyPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../asset/css/Mypage.css";

export default function MyPage() {
  const navigate = useNavigate();

  // 더미 사용자 정보 (테스트용)
  const [profile] = useState({
    nickname: "guest_user",
    email: "guest@example.com",
  });

  return (
    <div className="mypage-wrap">
      <header className="mypage-header">
        <div className="avatar" aria-hidden="true" />
        <div className="userbox">
          <div className="nickname">{profile.nickname}</div>
          <div className="email">{profile.email}</div>
        </div>

        <div className="quick-actions">
          <button
            className="chip"
            onClick={() => navigate("/mypage/edit")}
          >
            프로필 수정
          </button>
          <button
            className="chip"
            onClick={() => navigate("/mypage/password")}
          >
            비밀번호 변경
          </button>
        </div>
      </header>

      <section className="links">
        <button
          className="link-item"
          onClick={() => navigate("/mypage/comments")}
        >
          내 댓글
        </button>
        <button
          className="link-item"
          onClick={() => navigate("/mypage/likes")}
        >
          관심 패션
        </button>
      </section>

      <section className="cs">
        <div className="cs-title">문의 및 알림</div>
        <ul className="cs-list">
          <li>
            <button onClick={() => navigate("/cs")}>고객센터</button>
          </li>
          <li>
            <button onClick={() => navigate("/policy")}>약관 및 정책</button>
          </li>
        </ul>
      </section>
    </div>
  );
}
