import React, { useState } from 'react';
import api from '../../../common/api/api';
import '../Mypage.css'; // Reusing Mypage.css for styling
import LoadingSpinner from '../../../common/components/LoadingSpinner'; // Import LoadingSpinner

function PasswordResetForm() {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState(1); // 1: Request code, 2: Reset password
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleRequestCode = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await api.post('/api/mypage/password-reset/request', { userEmail: email });
      setSuccess('Verification code sent to your email.');
      setStep(2);
    } catch (err) {
      console.error("Error requesting password reset code:", err);
      setError(err.response?.data || 'Failed to send verification code.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    try {
      await api.post('/api/mypage/password-reset/confirm', {
        userEmail: email,
        emailCode: code,
        newPassword: newPassword,
      });
      setSuccess('Password reset successfully!');
      setStep(1); // Optionally reset form or navigate
      setEmail('');
      setCode('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      console.error("Error resetting password:", err);
      setError(err.response?.data || 'Failed to reset password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="passwordResetForm">
      <h2 className="pf-title">비밀번호 변경</h2>

      {error && <div className="pf-error">{error}</div>}
      {success && <div className="pf-success">{success}</div>}

      {step === 1 && (
        <form onSubmit={handleRequestCode}>
          <div className="pf-row">
            <label htmlFor="resetEmail" className="pf-label">이메일</label>
            <input
              id="resetEmail"
              className="pf-input"
              type="email"
              placeholder="등록된 이메일 주소"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="pf-footer">
            <button className="pf-submit" disabled={loading}>
              {loading ? <><LoadingSpinner /> <span style={{ marginLeft: '8px' }}>전송 중…</span></> : '인증 코드 전송'}
            </button>
          </div>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleResetPassword}>
          <div className="pf-row">
            <label htmlFor="resetEmailConfirm" className="pf-label">이메일</label>
            <input
              id="resetEmailConfirm"
              className="pf-input"
              type="email"
              value={email}
              disabled
            />
          </div>
          <div className="pf-row">
            <label htmlFor="verificationCode" className="pf-label">인증 코드</label>
            <input
              id="verificationCode"
              className="pf-input"
              type="text"
              placeholder="이메일로 받은 인증 코드"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />
          </div>
          <div className="pf-row">
            <label htmlFor="newPassword" className="pf-label">새 비밀번호</label>
            <input
              id="newPassword"
              className="pf-input"
              type="password"
              placeholder="새 비밀번호"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div className="pf-row">
            <label htmlFor="confirmPassword" className="pf-label">새 비밀번호 확인</label>
            <input
              id="confirmPassword"
              className="pf-input"
              type="password"
              placeholder="새 비밀번호 확인"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <div className="pf-footer">
            <button className="pf-submit" disabled={loading}>
              {loading ? <><LoadingSpinner /> <span style={{ marginLeft: '8px' }}>변경 중…</span></> : '비밀번호 변경'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default PasswordResetForm;
