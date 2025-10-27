import React from 'react';
import { NavLink } from 'react-router-dom';
import useSignUp from './hook/useSignUp'; // 새로 생성한 훅 임포트
import './SignUp.css'; // Import the CSS file

function SignUp() {
    const {
        id, email, password, confirmPassword, nickname, verificationCode,
        idError, emailError, nicknameError, generalError, success,
        emailVerificationMessage, idVerificationMessage, nicknameVerificationMessage,
        emailSent, emailVerified, countdown, isIdUnique, isNicknameUnique, passwordMatchMessage,
        handleSendVerificationEmail, handleVerifyEmailCode, handleCheckIdDuplication,
        handleCheckNicknameDuplication, handleSubmit, navigate,
        setEmailSent, setEmailVerified, setCountdown, setIsIdUnique, setIsNicknameUnique,
        setIdVerificationMessage, setIdError, setEmailError, setNicknameVerificationMessage, setNicknameError, setEmailVerificationMessage
    } = useSignUp();

    return (
        <div className="signup-container">
            <form onSubmit={handleSubmit} className="signup-form">
                {generalError && <p className="signup-error">{generalError}</p>}
                {success && <p className="signup-success">{success}</p>}

                <div className="signup-form-group">
                    <label htmlFor="id" className="signup-label">아이디:</label>
                    <div className="signup-input-with-button">
                        <input
                            type="text"
                            id="id"
                            {...id}
                            required
                            className="signup-input"
                            onChange={(e) => { id.onChange(e); setIsIdUnique(false); setIdVerificationMessage(''); setIdError(''); }}
                        />
                        <button
                            type="button"
                            onClick={handleCheckIdDuplication}
                            disabled={!id.value || isIdUnique}
                            className="signup-check-button"
                        >
                            {isIdUnique ? '확인 완료' : '중복 확인'}
                        </button>
                    </div>
                    {idError && <p className="signup-error">{idError}</p>}
                    {idVerificationMessage && isIdUnique && (
                        <p className="signup-success">{idVerificationMessage}</p>
                    )}
                </div>

                <div className="signup-form-group">
                    <label htmlFor="email" className="signup-label">이메일:</label>
                    <div className="signup-input-with-button">
                        <input
                            type="email"
                            id="email"
                            {...email}
                            required
                            className="signup-input"
                            disabled={emailSent}
                            onChange={(e) => { email.onChange(e); setEmailSent(false); setEmailVerified(false); setCountdown(0); setEmailVerificationMessage(''); setEmailError(''); }}
                        />
                        <button
                            type="button"
                            onClick={handleSendVerificationEmail}
                            disabled={!email.value || emailSent}
                            className="signup-send-code-button"
                        >
                            {emailSent && countdown > 0 ? `재전송 (${countdown}s)` : '인증 코드 전송'}
                        </button>
                    </div>
                    {emailError && <p className="signup-error">{emailError}</p>}
                </div>

                {emailSent && (
                    <div className="signup-form-group">
                        <label htmlFor="emailVerification" className="signup-label">인증 코드:</label>
                        <div className="signup-input-with-button">
                            <input
                                type="text"
                                id="emailVerification"
                                {...verificationCode}
                                required
                                className="signup-input"
                                disabled={emailVerified}
                                onChange={(e) => { verificationCode.onChange(e); setEmailError(''); }}
                            />
                            <button
                                type="button"
                                onClick={handleVerifyEmailCode}
                                disabled={emailVerified || !emailSent}
                                className="signup-verify-code-button"
                            >
                                {emailVerified ? '인증 완료' : '코드 확인'}
                            </button>
                        </div>
                        {emailError && <p className="signup-error">{emailError}</p>}
                        {emailVerificationMessage && emailVerified && (
                            <p className="signup-success">{emailVerificationMessage}</p>
                        )}
                    </div>
                )}

                <div className="signup-form-group">
                    <label htmlFor="password" className="signup-label">비밀번호:</label>
                    <input
                        type="password"
                        id="password"
                        {...password}
                        required
                        className="signup-input"
                        onChange={(e) => { password.onChange(e); }}
                    />
                </div>
                <div className="signup-form-group">
                    <label htmlFor="confirmPassword" className="signup-label">비밀번호 확인:</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        {...confirmPassword}
                        required
                        className="signup-input"
                        onChange={(e) => { confirmPassword.onChange(e); }}
                    />
                    {passwordMatchMessage.message && (
                        <p className={passwordMatchMessage.type === 'error' ? 'signup-password-mismatch' : 'signup-password-match'}>
                            {passwordMatchMessage.message}
                        </p>
                    )}
                </div>


                <div className="signup-form-group">
                    <label htmlFor="nickname" className="signup-label">닉네임:</label>
                    <div className="signup-input-with-button">
                        <input
                            type="text"
                            id="nickname"
                            {...nickname}
                            required
                            className="signup-input"
                            onChange={(e) => { nickname.onChange(e); setIsNicknameUnique(false); setNicknameVerificationMessage(''); setNicknameError(''); }}
                        />
                        <button
                            type="button"
                            onClick={handleCheckNicknameDuplication}
                            disabled={!nickname.value || isNicknameUnique}
                            className="signup-check-button"
                        >
                            {isNicknameUnique ? '확인 완료' : '중복 확인'}
                        </button>
                    </div>
                    {nicknameError && <p className="signup-error">{nicknameError}</p>}
                    {nicknameVerificationMessage && isNicknameUnique && (
                        <p className="signup-success">{nicknameVerificationMessage}</p>
                    )}
                </div>

                <button type="submit" className="signup-button" disabled={!emailVerified || !isIdUnique || !isNicknameUnique}>
                    회원가입
                </button>
            </form>
            <p className="signup-login-link">
                이미 계정이 있으신가요? <span onClick={() => navigate('/signin')} className="signup-link">로그인</span>
            </p>
        </div>
    );
}

export default SignUp;