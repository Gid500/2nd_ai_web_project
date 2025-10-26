import React from 'react';
import '../Mypage.css'; // Reusing Mypage.css for styling
import LoadingSpinner from '../../../common/components/LoadingSpinner'; // Import LoadingSpinner
import usePasswordResetForm from '../hook/usePasswordResetForm'; // 새로 생성한 훅 임포트

function PasswordResetForm() {
  const {
    email,
    code,
    newPassword,
    confirmPassword,
    step,
    loading,
    error,
    success,
    handleRequestCode,
    handleResetPassword,
  } = usePasswordResetForm();

  return (
    <div className="mypage-password-reset-form">
      <h2 className="mypage-title">비밀번호 변경</h2>

      {error && <div className="mypage-error">{error}</div>}
      {success && <div className="mypage-success">{success}</div>}

      {step === 1 && (
        <form onSubmit={handleRequestCode}>
          <div className="mypage-row">
            <label htmlFor="resetEmail" className="mypage-label">이메일</label>
            <div className="mypage-input-button-group">
              <input
                id="resetEmail"
                className="mypage-input"
                type="email"
                placeholder="등록된 이메일 주소"
                value={email.value} // useInput 훅의 value 사용
                onChange={email.onChange} // useInput 훅의 onChange 사용
                required
              />
              <button className="mypage-btn mypage-submit" disabled={loading}>
                {loading ? <><LoadingSpinner /> <span style={{ marginLeft: '8px' }}>전송 중…</span></> : '인증 코드 전송'}
              </button>
            </div>
          </div>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleResetPassword}>
          <div className="mypage-row">
            <label htmlFor="resetEmailConfirm" className="mypage-label">이메일</label>
            <input
              id="resetEmailConfirm"
              className="mypage-input"
              type="email"
              value={email.value}
              disabled
            />
          </div>
          <div className="mypage-row">
            <label htmlFor="verificationCode" className="mypage-label">인증 코드</label>
            <input
              id="verificationCode"
              className="mypage-input"
              type="text"
              placeholder="이메일로 받은 인증 코드"
              value={code.value}
              onChange={code.onChange}
              required
            />
          </div>
          <div className="mypage-row">
            <label htmlFor="newPassword" className="mypage-label">새 비밀번호</label>
            <input
              id="newPassword"
              className="mypage-input"
              type="password"
              placeholder="새 비밀번호"
              value={newPassword.value}
              onChange={newPassword.onChange}
              required
            />
          </div>
          <div className="mypage-row">
            <label htmlFor="confirmPassword" className="mypage-label">새 비밀번호 확인</label>
            <input
              id="confirmPassword"
              className="mypage-input"
              type="password"
              placeholder="새 비밀번호 확인"
              value={confirmPassword.value}
              onChange={confirmPassword.onChange}
              required
            />
          </div>
          <div className="mypage-footer">
            <button className="mypage-submit" disabled={loading}>
              {loading ? <><LoadingSpinner /> <span style={{ marginLeft: '8px' }}>변경 중…</span></> : '비밀번호 변경'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default PasswordResetForm;
