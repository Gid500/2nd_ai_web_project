import React, { useRef, useState } from 'react';
import './Mypage.css';

function ProfileForm() {
  const fileRef = useRef(null);

  // 폼 상태
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [nickname, setNickname] = useState('');
  const [bio, setBio] = useState('');

  // 유효성/피드백
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');

  // 이미지 선택
  const onPickFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 유효성 검사 (형식/용량)
    const validTypes = ['image/png', 'image/jpeg', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      setError('PNG/JPG/WebP/GIF 파일만 업로드할 수 있어요.');
      e.target.value = '';
      return;
    }
    const maxSizeMB = 5;
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`파일이 너무 커요. ${maxSizeMB}MB 이하로 올려주세요.`);
      e.target.value = '';
      return;
    }

    setError('');
    setAvatarFile(file);

    // 미리보기 생성
    const reader = new FileReader();
    reader.onload = () => setAvatarPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const clearAvatar = () => {
    setAvatarFile(null);
    setAvatarPreview(null);
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      // 실제 API 경로로 바꿔 쓰세요.
      // 예: POST /api/profile (multipart/form-data)
      const form = new FormData();
      if (avatarFile) form.append('avatar', avatarFile);
      form.append('nickname', nickname);
      form.append('bio', bio);

      // 데모용: 실제 API 없을 때는 setTimeout으로 대체
      // 실제로는 fetch/axios 사용
      // const res = await fetch('/api/profile', { method: 'POST', body: form });
      // if (!res.ok) throw new Error('업데이트 실패');
      await new Promise((r) => setTimeout(r, 800));

      setSuccess('프로필이 저장되었어요!');
    } catch (err) {
      setError(err.message || '저장 중 문제가 발생했어요.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="profileForm" onSubmit={handleSubmit}>
      <h2 className="pf-title">프로필 변경</h2>

      {/* 아바타 업로드 */}
      <div className="pf-row">
        <label className="pf-label">프로필 이미지</label>
        <div className="pf-avatarRow">
          <div className="pf-avatar">
            {avatarPreview ? (
              <img src={avatarPreview} alt="미리보기" />
            ) : (
              <div className="pf-avatarPlaceholder">이미지 없음</div>
            )}
          </div>

          <div className="pf-actions">
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={onPickFile}
              style={{ display: 'none' }}
            />
            <button
              type="button"
              className="pf-btn"
              onClick={() => fileRef.current?.click()}
            >
              이미지 선택
            </button>
            {avatarPreview && (
              <button
                type="button"
                className="pf-btn pf-ghost"
                onClick={clearAvatar}
              >
                선택 취소
              </button>
            )}
            <p className="pf-hint">PNG/JPG/WebP/GIF, 최대 5MB</p>
          </div>
        </div>
      </div>

      {/* 닉네임 */}
      <div className="pf-row">
        <label htmlFor="nickname" className="pf-label">닉네임</label>
        <input
          id="nickname"
          className="pf-input"
          type="text"
          placeholder="표시할 이름"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          maxLength={20}
        />
      </div>

      {/* 소개글 */}
      <div className="pf-row">
        <label htmlFor="bio" className="pf-label">소개</label>
        <textarea
          id="bio"
          className="pf-textarea"
          placeholder="한 줄 소개를 적어보세요"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={3}
          maxLength={120}
        />
        <div className="pf-counter">{bio.length}/120</div>
      </div>

      {/* 피드백 */}
      {error && <div className="pf-error">{error}</div>}
      {success && <div className="pf-success">{success}</div>}

      {/* 제출 */}
      <div className="pf-footer">
        <button className="pf-submit" disabled={saving}>
          {saving ? '저장 중…' : '저장하기'}
        </button>
      </div>
    </form>
  );
}

export default ProfileForm;
