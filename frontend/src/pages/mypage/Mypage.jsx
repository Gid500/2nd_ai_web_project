import React from 'react';
import './Mypage.css';
import MypageTab from '../../common/Mypagetab';
import ProfileForm from './ProfileForm';
import PasswordResetForm from './components/PasswordResetForm';
import { useAuth } from '../../common/hook/AuthProvider'; // AuthProvider에서 useAuth 임포트
import LoadingSpinner from '../../common/components/LoadingSpinner';

function Mypage() {
  const { userId, loading: authLoading } = useAuth();

  return (
    <div className="parents">
        <div className="profileForm">
        
        
        <h2 className="pf-title">프로필 수정</h2>

            <MypageTab />

            {authLoading ? (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100px' }}>
                <LoadingSpinner />
              </div>
            ) : (
              userId ? <ProfileForm userId={userId} /> : <p>로그인 정보가 없습니다.</p>
            )}

            <PasswordResetForm />

        </div>
    </div>
  );
}

export default Mypage;
