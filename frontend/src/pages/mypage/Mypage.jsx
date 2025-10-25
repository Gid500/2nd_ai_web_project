import React, { useRef, useState } from 'react';
import './Mypage.css'; // 아래 CSS 스니펫 추가해서 사용(원하면 기존 파일 써도 됨)
import MypageTab from '../../common/Mypagetab';

function Mypage() {
  const fileRef = useRef(null);

  // 폼 상태
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [nickname, setNickname] = useState('');
  const [bio, setBio] = useState('');

  // 피드백
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');

  // 파일 선택
  const onPickFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

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
      // TODO: 실제 API로 교체
      // const form = new FormData();
      // if (avatarFile) form.append('avatar', avatarFile);
      // form.append('nickname', nickname);
      // form.append('bio', bio);
      // const res = await fetch('/api/profile', { method: 'POST', body: form });
      // if (!res.ok) throw new Error('업데이트 실패');

      await new Promise((r) => setTimeout(r, 800)); // 데모용
      setSuccess('프로필이 저장되었어요!');
    } catch (err) {
      setError(err.message || '저장 중 문제가 발생했어요.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="parents">
        <div className="profileForm">
        
        
        <h2 className="pf-title">프로필 수정</h2>

            <MypageTab />

        <form onSubmit={handleSubmit}>
            {/* 아바타 */}
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
            <label htmlFor="nickname" className="pf-label">
                닉네임
            </label>
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

            {/* 소개 */}
            <div className="pf-row">
            <label htmlFor="bio" className="pf-label">
                소개
            </label>
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

            <div className="pf-footer">
            <button className="pf-submit" disabled={saving}>
                {saving ? '저장 중…' : '저장하기'}
            </button>
            </div>
        </form>
        </div>
    </div>
  );
}

export default Mypage;
