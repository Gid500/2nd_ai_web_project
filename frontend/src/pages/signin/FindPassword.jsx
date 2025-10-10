import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useInput from "../../common/hook/useInput";
import api from "../../common/api/axios";
import "../../asset/css/SignUp.css"; // 회원가입과 동일 스타일 재사용

export default function FindPassword() {
  const navigate = useNavigate();

  // inputs
  const [email, onChangeEmail] = useInput("");
  const [code, onChangeCode] = useInput("");
  const [pwd, onChangePwd] = useInput("");
  const [pwd2, onChangePwd2] = useInput("");

  // ui state
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [pwdOk, setPwdOk] = useState(false);

  const canSubmit = emailVerified && pwdOk;

  const handleSendEmail = async () => {
    if (!email) return alert("이메일을 입력하세요.");
    try {
      setLoading(true);
      // 인증 메일 발송
      await api.post("/auth/password/reset/send", { email });
      setEmailSent(true);
      alert("인증 메일을 전송했습니다.");
    } catch (e) {
      console.error(e);
      alert("이메일 전송에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!emailSent) return alert("먼저 이메일 인증을 요청하세요.");
    if (!code) return alert("인증코드를 입력하세요.");
    try {
      setLoading(true);
      // 인증코드 확인
      const { data } = await api.post("/auth/password/reset/verify", { email, code });
      if (data?.verified) {
        setEmailVerified(true);
        alert("이메일 인증 완료");
      } else {
        setEmailVerified(false);
        alert("인증코드가 올바르지 않습니다.");
      }
    } catch (e) {
      console.error(e);
      alert("인증 확인에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handlePwdCheck = () => {
    if (!pwd || !pwd2) return setPwdOk(false);
    const ok = pwd.length >= 6 && pwd === pwd2;
    setPwdOk(ok);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return alert("이메일 인증 및 비밀번호 확인을 완료하세요.");
    try {
      setLoading(true);
      // 최종 비밀번호 변경
      await api.put("/auth/password/reset", { email, code, newPassword: pwd });
      alert("비밀번호가 변경되었습니다. 새 비밀번호로 로그인하세요.");
      navigate("/signIn");
    } catch (e) {
      console.error(e);
      alert("비밀번호 변경에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">{/* 스타일 재사용 */}
      <form className="signup-form" onSubmit={handleSubmit}>
        <h2>Find Password</h2>

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
              disabled={loading || !email}
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
              disabled={loading || !emailSent || !code}
            >
              확인
            </button>
          </div>
          {emailVerified && <p className="hint ok">이메일 인증 완료</p>}
        </div>

        {/* 새 비밀번호 */}
        <div className="form-group">
          <label htmlFor="pwd">새 비밀번호</label>
          <input
            id="pwd"
            name="pwd"
            type="password"
            value={pwd}
            onChange={onChangePwd}
            onBlur={handlePwdCheck}
            placeholder="6자 이상"
            autoComplete="new-password"
          />
        </div>

        {/* 새 비밀번호 재입력 */}
        <div className="form-group">
          <label htmlFor="pwd2">새 비밀번호 재입력</label>
          <input
            id="pwd2"
            name="pwd2"
            type="password"
            value={pwd2}
            onChange={onChangePwd2}
            onBlur={handlePwdCheck}
            autoComplete="new-password"
          />
          {!pwdOk && pwd2.length > 0 && (
            <p className="hint error">비밀번호가 일치하지 않습니다.</p>
          )}
          {pwdOk && pwd2.length > 0 && (
            <p className="hint ok">비밀번호 일치</p>
          )}
        </div>

        <button type="submit" className="signup-button" disabled={loading || !canSubmit}>
          비밀번호 변경
        </button>
      </form>
    </div>
  );
}
