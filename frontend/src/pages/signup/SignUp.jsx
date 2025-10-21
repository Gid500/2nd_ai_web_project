import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useInput from "../../common/hook/useInput";
import useAxios from "../../common/hook/useAxios";
import "../../asset/css/SignUp.css";

export default function SignUp() {
  const navigate = useNavigate();
  const { request, loading: axiosLoading, error: axiosError } = useAxios();

  // inputs
  const [email, onChangeEmail] = useInput("");
  const [code, onChangeCode] = useInput("");
  const [userId, onChangeUserId] = useInput(""); // userId 상태 추가
  const [pwd, onChangePwd] = useInput("");
  const [pwd2, onChangePwd2] = useInput("");
  const [nickname, onChangeNickname] = useInput("");
  const [name, onChangeName] = useInput("");

  // ui state
  const [emailSent, setEmailSent] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [userIdChecked, setUserIdChecked] = useState(false); // userId 중복 확인 상태 추가
  const [pwdOk, setPwdOk] = useState(false);
  const [pwdTouched, setPwdTouched] = useState(false);
  const [nickChecked, setNickChecked] = useState(false);

  const canSubmit = emailVerified && userIdChecked && pwdOk && nickChecked && !!name; // canSubmit 로직 업데이트

  const handleSendEmail = async () => {
    if (!email) return alert("이메일을 입력하세요.");
    try {
      await request({ url: `/api/signup/send-verification`, method: "POST", data: { email: email } }); // 엔드포인트 변경
      setEmailSent(true);
      alert("인증 메일을 전송했습니다.");
    } catch (e) {
      console.error(e);
      alert("이메일 전송 실패");
    }
  };

  const handleVerifyCode = async () => {
    if (!emailSent) return alert("먼저 이메일 인증을 요청하세요.");
    if (!code) return alert("인증코드를 입력하세요.");
    try {
      const data = await request({ url: `/api/signup/verify-code`, method: "POST", data: { email: email, code } }); // 엔드포인트 변경
      if (data?.isVerified) { // 필드명 변경
        setEmailVerified(true);
        alert("이메일 인증 완료");
      } else {
        setEmailVerified(false);
        alert("인증코드가 올바르지 않습니다.");
      }
    } catch (e) {
      console.error(e);
      alert("이메일 인증 실패");
    }
  };

  const handlePwdCheck = () => {
    setPwdTouched(true);
    if (!pwd || !pwd2) return setPwdOk(false);
    const ok = pwd.length >= 8 && pwd === pwd2;
    setPwdOk(ok);
  };

  const handleCheckNickname = async () => {
    if (!nickname) return alert("닉네임을 입력하세요.");
    try {
      const data = await request({ url: `/api/signup/check-nickname`, method: "GET", params: { nickname } }); // 엔드포인트 변경
      if (data?.isDuplicated === false) { // 필드명 변경 및 로직 반전
        setNickChecked(true);
        alert("사용 가능한 닉네임입니다.");
      } else {
        setNickChecked(false);
        alert("이미 사용 중인 닉네임입니다.");
      }
    } catch (e) {
      console.error(e);
      alert("닉네임 중복확인 실패");
    }
  };

  const handleCheckUserId = async () => {
    if (!userId) return alert("아이디를 입력하세요.");
    try {
      const data = await request({ url: `/api/signup/check-userid`, method: "GET", params: { userId } });
      if (data?.isDuplicated === false) {
        setUserIdChecked(true);
        alert("사용 가능한 아이디입니다.");
      } else {
        setUserIdChecked(false);
        alert("이미 사용 중인 아이디입니다.");
      }
    } catch (e) {
      console.error(e);
      alert("아이디 중복확인 실패");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return alert("필수 확인을 모두 완료하세요.");
    try {
      await request({
        url: "/api/signup/register",
        method: "POST",
        data: {
          userEmail: email,
          userPwd: pwd,
          userNickname: nickname,
          userName: name,
          userId: userId, // userId 추가
        },
      });
      alert("회원가입이 완료되었습니다.");
      navigate("/signIn");
    } catch (e) {
      console.error(e);
      alert("회원가입 실패");
    }
  };

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={handleSubmit}>
        <h2>Sign Up</h2>

        {/* Email + 인증요청 */}
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <div className="form-group-flex">
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmailSent(false);
                setEmailVerified(false);
                onChangeEmail(e);
              }}
            />
            <button
              type="button"
              className="btn-ghost"
              onClick={handleSendEmail}
              disabled={axiosLoading || !email}
            >
              {emailSent ? "재전송" : "인증요청"}
            </button>
          </div>
        </div>

        {/* 인증코드 + 확인 */}
        <div className="form-group">
          <label htmlFor="code">인증코드</label>
          <div className="form-group-flex">
            <input
              id="code"
              name="code"
              type="text"
              value={code}
              onChange={onChangeCode}
              disabled={!emailSent}
              placeholder={emailSent ? "" : "이메일 인증요청 먼저"}
            />
            <button
              type="button"
              className="btn-ghost"
              onClick={handleVerifyCode}
              disabled={axiosLoading || !emailSent || !code}
            >
              확인
            </button>
          </div>
          {emailVerified && <p className="hint ok">이메일 인증 완료</p>}
        </div>

        {/* 아이디 + 중복확인 */}
        <div className="form-group">
          <label htmlFor="userId">아이디</label>
          <div className="form-group-flex">
            <input
              id="userId"
              name="userId"
              type="text"
              value={userId}
              onChange={(e) => {
                setUserIdChecked(false);
                onChangeUserId(e);
              }}
            />
            <button
              type="button"
              className="btn-ghost"
              onClick={handleCheckUserId}
              disabled={axiosLoading || !userId}
            >
              중복확인
            </button>
          </div>
          {userIdChecked && <p className="hint ok">사용 가능한 아이디</p>}
        </div>

        {/* 비밀번호 / 재입력 + 일치확인 */}
        <div className="form-group">
          <label htmlFor="pwd">비밀번호</label>
          <input
            id="pwd"
            name="pwd"
            type="password"
            value={pwd}
            onChange={onChangePwd}
            onBlur={handlePwdCheck}
            placeholder="8자 이상"
            autoComplete="new-password"
          />
        </div>

        <div className="form-group">
          <label htmlFor="pwd2">비밀번호 재입력</label>
          <div className="form-group-flex">
            <input
              id="pwd2"
              name="pwd2"
              type="password"
              value={pwd2}
              onChange={(e) => {
                setPwdTouched(false);
                onChangePwd2(e);
              }}
              onBlur={handlePwdCheck}
              autoComplete="new-password"
            />
          </div>
        {!pwdOk && pwd2.length > 0 && pwdTouched && (
            <p className="hint error">비밀번호가 일치하지 않습니다.</p>)}
        {pwdOk && pwd2.length > 0 && pwdTouched && (
            <p className="hint ok">비밀번호 일치</p>)}
        </div>

        {/* 닉네임 + 중복확인 */}
        <div className="form-group">
          <label htmlFor="nickname">닉네임</label>
          <div className="form-group-flex">
            <input
              id="nickname"
              name="nickname"
              type="text"
              value={nickname}
              onChange={(e) => {
                setNickChecked(false);
                onChangeNickname(e);
              }}
            />
            <button
              type="button"
              className="btn-ghost"
              onClick={handleCheckNickname}
              disabled={axiosLoading || !nickname}
            >
              중복확인
            </button>
          </div>
          {nickChecked && <p className="hint ok">사용 가능한 닉네임</p>}
        </div>

        {/* 이름 */}
        <div className="form-group">
          <label htmlFor="name">이름</label>
          <input
            id="name"
            name="name"
            type="text"
            value={name}
            onChange={onChangeName}
          />
        </div>

        {/* 회원가입 버튼 */}
        <button type="submit" className="signup-button" disabled={axiosLoading || !canSubmit}>
          회원가입
        </button>
      </form>
    </div>
  );
}
