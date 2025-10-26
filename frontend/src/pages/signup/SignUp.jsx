import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useInput from '../../common/hook/useInput';
import { useSignupApi } from './api/signupApi';
import { useAuth } from '../../common/hook/AuthProvider';
import './SignUp.css'; // Import the CSS file

function SignUp() {
    const navigate = useNavigate();
    const { signup, sendVerificationEmail, verifyEmailCode, checkEmailDuplication, checkNicknameDuplication, checkIdDuplication } = useSignupApi();
    const { login } = useAuth(); // Assuming login is available in useAuth

    const id = useInput('');
    const email = useInput('');
    const password = useInput('');
    const confirmPassword = useInput('');
    const nickname = useInput('');
    const verificationCode = useInput('');

    // Specific error states for each input
    const [idError, setIdError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [nicknameError, setNicknameError] = useState('');
    const [generalError, setGeneralError] = useState(''); // For non-field specific errors

    const [success, setSuccess] = useState('');
    const [emailVerificationMessage, setEmailVerificationMessage] = useState('');
    const [idVerificationMessage, setIdVerificationMessage] = useState('');
    const [nicknameVerificationMessage, setNicknameVerificationMessage] = useState('');
    const [emailSent, setEmailSent] = useState(false);
    const [emailVerified, setEmailVerified] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const [isIdUnique, setIsIdUnique] = useState(false);
    const [isEmailUnique, setIsEmailUnique] = useState(false);
    const [isNicknameUnique, setIsNicknameUnique] = useState(false);
    const [passwordMatchMessage, setPasswordMatchMessage] = useState({ message: '', type: '' });

    useEffect(() => {
        let timer;
        if (countdown > 0) {
            timer = setTimeout(() => setCountdown(countdown - 1), 1000);
        }
        return () => clearTimeout(timer);
    }, [countdown]);

    useEffect(() => {
        if (password.value && confirmPassword.value) {
            if (password.value === confirmPassword.value) {
                setPasswordMatchMessage({ message: '비밀번호가 일치합니다.', type: 'success' });
                setPasswordError('');
            } else {
                setPasswordMatchMessage({ message: '비밀번호가 일치하지 않습니다.', type: 'error' });
                setPasswordError('비밀번호가 일치하지 않습니다.');
            }
        } else if (password.value || confirmPassword.value) {
            // 한쪽만 입력되었을 경우 메시지를 비웁니다.
            setPasswordMatchMessage({ message: '', type: '' });
            setPasswordError('');
        } else {
            // 둘 다 비어있을 경우 메시지를 비웁니다.
            setPasswordMatchMessage({ message: '', type: '' });
            setPasswordError('');
        }
    }, [password.value, confirmPassword.value]);



    const handleSendVerificationEmail = async () => {
        setEmailError('');
        setGeneralError('');
        setSuccess('');
        if (!email.value) {
            setEmailError('이메일을 입력해주세요.');
            return;
        }

        try {
            const emailDuplicationResponse = await checkEmailDuplication(email.value);
            if (!emailDuplicationResponse.isUnique) {
                setEmailError('이미 사용 중인 이메일입니다.');
                setIsEmailUnique(false);
                return;
            }
            setIsEmailUnique(true);

            await sendVerificationEmail(email.value);
            setEmailSent(true);
            setCountdown(180); // 3 minutes
            setSuccess('인증 코드가 이메일로 전송되었습니다.');
        } catch (err) {
            setEmailError(err.response?.data?.message || '이메일 확인 및 인증 코드 전송 실패');
        }
    };

    const handleVerifyEmailCode = async () => {
        setEmailError('');
        setGeneralError('');
        setSuccess('');
        setEmailVerificationMessage('');
        if (!email.value || !verificationCode.value) {
            setEmailError('이메일과 인증 코드를 모두 입력해주세요.');
            return;
        }
        try {
            const response = await verifyEmailCode(email.value, verificationCode.value);
            if (response.isVerified) {
                setEmailVerified(true);
                setEmailVerificationMessage('이메일이 성공적으로 인증되었습니다.');
                setEmailError('');
            } else {
                setEmailError('인증 코드가 일치하지 않습니다.');
            }
        } catch (err) {
            setEmailError(err.response?.data?.message || '인증 코드 확인 실패');
        }
    };

    const handleCheckIdDuplication = async () => {
        setIdError('');
        setGeneralError('');
        setSuccess('');
        setIdVerificationMessage('');
        if (!id.value) {
            setIdError('아이디를 입력해주세요.');
            return;
        }
        try {
            const response = await checkIdDuplication(id.value);
            if (response.isUnique) {
                setIsIdUnique(true);
                setIdVerificationMessage('사용 가능한 아이디입니다.');
                setIdError('');
            } else {
                setIsIdUnique(false);
                setIdError('이미 사용 중인 아이디입니다.');
            }
        } catch (err) {
            setIdError(err.response?.data?.message || '아이디 중복 확인 실패');
        }
    };

    const handleCheckNicknameDuplication = async () => {
        setNicknameError('');
        setGeneralError('');
        setSuccess('');
        setNicknameVerificationMessage('');
        if (!nickname.value) {
            setNicknameError('닉네임을 입력해주세요.');
            return;
        }
        try {
            const response = await checkNicknameDuplication(nickname.value);
            if (response.isUnique) {
                setIsNicknameUnique(true);
                setNicknameVerificationMessage('사용 가능한 닉네임입니다.');
                setNicknameError('');
            } else {
                setIsNicknameUnique(false);
                setNicknameError('이미 사용 중인 닉네임입니다.');
            }
        } catch (err) {
            setNicknameError(err.response?.data?.message || '닉네임 중복 확인 실패');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setGeneralError('');
        setSuccess('');

        // Clear all specific errors at the start of submission
        setIdError('');
        setEmailError('');
        setPasswordError('');
        setNicknameError('');

        let hasError = false;

        if (password.value !== confirmPassword.value) {
            setPasswordError('비밀번호가 일치하지 않습니다.');
            setPasswordMatchMessage({ message: '비밀번호가 일치하지 않습니다.', type: 'error' });
            hasError = true;
        } else {
            setPasswordError('');
            setPasswordMatchMessage({ message: '비밀번호가 일치합니다.', type: 'success' });
        }

        if (!isIdUnique) {
            setIdError('아이디 중복 확인을 완료해주세요.');
            hasError = true;
        }

        if (!emailVerified) {
            setEmailError('이메일 인증을 완료해주세요.');
            hasError = true;
        }

        if (!isNicknameUnique) {
            setNicknameError('닉네임 중복 확인을 완료해주세요.');
            hasError = true;
        }

        if (hasError) {
            setGeneralError('모든 필수 정보를 올바르게 입력해주세요.');
            return;
        }

        try {
            const response = await signup({
                userId: id.value,
                userEmail: email.value,
                userPwd: password.value,
                userNickname: nickname.value,
            });
            setSuccess('회원가입 성공! 로그인 페이지로 이동합니다.');
            setTimeout(() => {
                navigate('/signin');
            }, 2000);
        } catch (err) {
            setGeneralError(err.response?.data?.message || '회원가입 실패');
        }
    };

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
                            onChange={(e) => { email.onChange(e); setIsEmailUnique(false); setEmailSent(false); setEmailVerified(false); setCountdown(0); setEmailVerificationMessage(''); setEmailError(''); }}
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
                        onChange={(e) => { password.onChange(e); setPasswordError(''); }}
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
                        onChange={(e) => { confirmPassword.onChange(e); setPasswordError(''); }}
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