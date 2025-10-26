import React from 'react';
import './Mypage.css';
import MypageTab from '../../common/Mypagetab';
import ProfileForm from './ProfileForm';
import PasswordResetForm from './components/PasswordResetForm';
import { useAuth } from '../../common/hook/useAuth';

function Mypage() {
  const { userId } = useAuth();

  return (
    <div className="parents">
        <div className="profileForm">
        
        
        <h2 className="pf-title">프로필 수정</h2>

            <MypageTab />

            {userId && <ProfileForm userId={userId} />}
            {!userId && <p>Loading user data or user not logged in...</p>}

            <PasswordResetForm />

        </div>
    </div>
  );
}

export default Mypage;
