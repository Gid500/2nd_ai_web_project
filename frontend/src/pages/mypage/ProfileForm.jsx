import React from 'react';
import './Mypage.css';
import useProfileForm from './hook/useProfileForm'; // 새로 생성한 훅 임포트

function ProfileForm({ userId }) {
  const {
    fileRef,
    avatarPreview,
    nickname,
    setNickname,
    error,
    saving,
    success,
    onPickFile,
    clearAvatar,
    handleSubmit,
    handleDeleteAccount,
    // 이메일 인증 관련 상태 및 함수
    showEmailVerification,
    setShowEmailVerification,
    verificationEmail,
    setVerificationEmail,
    verificationCode,
    setVerificationCode,
    emailSent,
    emailVerified,
    emailVerificationError,
    sendVerificationEmailRequest,
    verifyEmailCodeRequest,
  } = useProfileForm(userId);

  return (
    <form className="mypage-profile-form" onSubmit={handleSubmit}>
      {/* 이메일 인증 모달/섹션 */}
      {showEmailVerification && (
        <div className="mypage-email-verification-overlay">
          <div className="mypage-email-verification-modal">
            <h3>회원 탈퇴를 위한 이메일 인증</h3>
            <p>회원 탈퇴를 진행하려면 이메일 인증이 필요합니다.</p>

            <div className="mypage-row">
              <label htmlFor="verificationEmail" className="mypage-label">이메일</label>
              <input
                id="verificationEmail"
                className="mypage-input"
                type="email"
                value={verificationEmail}
                readOnly
              />
              <button
                type="button"
                className="mypage-btn"
                onClick={sendVerificationEmailRequest}
                disabled={emailSent}
              >
                {emailSent ? '재전송' : '인증 코드 발송'}
              </button>
            </div>

            {emailSent && !emailVerified && (
              <div className="mypage-row">
                <label htmlFor="verificationCode" className="mypage-label">인증 코드</label>
                <input
                  id="verificationCode"
                  className="mypage-input"
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  maxLength={6}
                />
                <button
                  type="button"
                  className="mypage-btn"
                  onClick={verifyEmailCodeRequest}
                >
                  인증 확인
                </button>
              </div>
            )}

            {emailVerificationError && <div className="mypage-error">{emailVerificationError}</div>}

            <div className="mypage-modal-actions">
              <button
                type="button"
                className="mypage-btn mypage-ghost"
                onClick={() => setShowEmailVerification(false)}
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 아바타 업로드 */}
      <div className="mypage-row">
        <label className="mypage-label">프로필 이미지</label>
        <div className="mypage-avatarRow">
          <div className="mypage-avatar">
            {avatarPreview ? (
              <img src={avatarPreview} alt="미리보기" />
            ) : (
              <div className="mypage-avatarPlaceholder">이미지 없음</div>
            )}
          </div>

          <div className="mypage-actions">
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={onPickFile}
              style={{ display: 'none' }}
            />
            <button
              type="button"
              className="mypage-btn"
              onClick={() => fileRef.current?.click()}
            >
              이미지 선택
            </button>
            {avatarPreview && (
              <button
                type="button"
                className="mypage-btn mypage-ghost"
                onClick={clearAvatar}
              >
                선택 취소
              </button>
            )}
            <p className="mypage-hint">PNG/JPG/WebP/GIF, 최대 5MB</p>
          </div>
        </div>
      </div>

      {/* 닉네임 */}
      <div className="mypage-row">
        <label htmlFor="nickname" className="mypage-label">닉네임</label>
        <div className="mypage-input-button-group">
          <input
            id="nickname"
            className="mypage-input"
            type="text"
            placeholder="표시할 이름"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            maxLength={20}
          />
          <button className="mypage-submit" disabled={saving}>
            {saving ? '저장 중…' : '저장하기'}
          </button>
        </div>
      </div>

      {/* 피드백 */}
      {error && <div className="mypage-error">{error}</div>}
      {success && <div className="mypage-success">{success}</div>}

      {/* 회원 탈퇴 버튼 */}
      <div className="mypage-row">
        <button
          type="button"
          className="mypage-btn mypage-delete-account"
          onClick={handleDeleteAccount}
        >
          회원 탈퇴
        </button>
      </div>
    </form>
  );
}

export default ProfileForm;
