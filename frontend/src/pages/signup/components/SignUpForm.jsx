import React from 'react';

const SignUpForm = ({ 
    id, email, password, confirmPassword, nickname, verificationCode,
    idError, emailError, nicknameError, generalError, success,
    emailVerificationMessage, idVerificationMessage, nicknameVerificationMessage,
    emailSent, emailVerified, countdown, isIdUnique, isNicknameUnique, passwordMatchMessage,
    handleSendVerificationEmail, handleVerifyEmailCode, handleCheckIdDuplication, handleCheckNicknameDuplication, handleSubmit
}) => {
    return (
        <form onSubmit={handleSubmit} className="signup-form">
            {generalError && <p className="SignUp-errorMessage">{generalError}</p>}
            {success && <p className="SignUp-successMessage">{success}</p>}

            {/* User ID Field */}
            <div className="form-group">
                <label htmlFor="userId">아이디</label>
                <input
                    type="text"
                    id="userId"
                    name="userId"
                    value={id.value}
                    onChange={id.onChange}
                    onBlur={handleCheckIdDuplication}
                    className={idError ? 'input-error' : ''}
                    placeholder="아이디를 입력하세요"
                />
                <button type="button" onClick={handleCheckIdDuplication} disabled={!id.value}>중복 확인</button>
                {idError && <p className="SignUp-errorMessage">{idError}</p>}
                {idVerificationMessage && <p className="SignUp-verificationMessage">{idVerificationMessage}</p>}
            </div>

            {/* Email Field */}
            <div className="form-group">
                <label htmlFor="email">이메일</label>
                <div className="email-verification-group">
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={email.value}
                        onChange={email.onChange}
                        className={emailError ? 'input-error' : ''}
                        placeholder="이메일을 입력하세요"
                    />
                    <button type="button" onClick={handleSendVerificationEmail} disabled={emailSent && countdown > 0}>인증 코드 전송</button>
                </div>
                {emailError && <p className="SignUp-errorMessage">{emailError}</p>}
                {emailVerificationMessage && <p className="SignUp-verificationMessage">{emailVerificationMessage}</p>}
            </div>

            {/* Verification Code Field */}
            {emailSent && !emailVerified && (
                <div className="form-group">
                    <label htmlFor="verificationCode">인증 코드</label>
                    <div className="email-verification-group">
                        <input
                            type="text"
                            id="verificationCode"
                            name="verificationCode"
                            value={verificationCode.value}
                            onChange={verificationCode.onChange}
                            className={emailError ? 'input-error' : ''}
                            placeholder="인증 코드를 입력하세요"
                        />
                        <button type="button" onClick={handleVerifyEmailCode} disabled={!verificationCode.value}>인증 확인</button>
                        {countdown > 0 && <span className="countdown">({Math.floor(countdown / 60)}:{('0' + (countdown % 60)).slice(-2)})</span>}
                    </div>
                </div>
            )}

            {/* Password Field */}
            <div className="form-group">
                <label htmlFor="password">비밀번호</label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    value={password.value}
                    onChange={password.onChange}
                    placeholder="비밀번호를 입력하세요"
                />
            </div>

            {/* Confirm Password Field */}
            <div className="form-group">
                <label htmlFor="confirmPassword">비밀번호 확인</label>
                <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={confirmPassword.value}
                    onChange={confirmPassword.onChange}
                    placeholder="비밀번호를 다시 입력하세요"
                />
                {passwordMatchMessage.message && (
                    <p className={passwordMatchMessage.type === 'error' ? 'SignUp-errorMessage' : 'SignUp-successMessage'}>
                        {passwordMatchMessage.message}
                    </p>
                )}
            </div>

            {/* Nickname Field */}
            <div className="form-group">
                <label htmlFor="nickname">닉네임</label>
                <input
                    type="text"
                    id="nickname"
                    name="nickname"
                    value={nickname.value}
                    onChange={nickname.onChange}
                    onBlur={handleCheckNicknameDuplication}
                    className={nicknameError ? 'input-error' : ''}
                    placeholder="닉네임을 입력하세요"
                />
                <button type="button" onClick={handleCheckNicknameDuplication} disabled={!nickname.value}>중복 확인</button>
                {nicknameError && <p className="SignUp-errorMessage">{nicknameError}</p>}
                {nicknameVerificationMessage && <p className="SignUp-verificationMessage">{nicknameVerificationMessage}</p>}
            </div>

            <button type="submit" className="submit-button">회원가입</button>
        </form>
    );
};

export default SignUpForm;
