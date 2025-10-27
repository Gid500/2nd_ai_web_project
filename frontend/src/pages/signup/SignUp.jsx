import React from 'react';
import { NavLink } from 'react-router-dom';
import useSignUpForm from './hook/useSignUpForm'; // useSignUpForm 훅 임포트
import SignUpForm from './components/SignUpForm'; // SignUpForm 컴포넌트 임포트
import './SignUp.css'; // Import the CSS file

function SignUp() {
    const signUpFormProps = useSignUpForm();

    return (
        <div className="signup-container">
            <SignUpForm {...signUpFormProps} />
            <p className="signup-login-link">
                이미 계정이 있으신가요? <span onClick={() => signUpFormProps.navigate('/signin')} className="signup-link">로그인</span>
            </p>
        </div>
    );
}

export default SignUp;
