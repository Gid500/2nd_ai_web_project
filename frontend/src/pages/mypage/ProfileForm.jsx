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
  } = useProfileForm(userId);

  return (
    <form className="mypage-profile-form" onSubmit={handleSubmit}>
      <h2 className="mypage-title">프로필 변경</h2>

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
    </form>
  );
}

export default ProfileForm;
