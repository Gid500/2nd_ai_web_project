import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useInput from '../../common/hook/useInput';
import { useSignupApi } from './api/signupApi';
import { useAuth } from '../../common/hook/useAuth';

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

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [emailSent, setEmailSent] = useState(false);
    const [emailVerified, setEmailVerified] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const [isIdUnique, setIsIdUnique] = useState(false);
    const [isEmailUnique, setIsEmailUnique] = useState(false); // This will be set after email duplication check within sendVerificationEmail
    const [isNicknameUnique, setIsNicknameUnique] = useState(false);

    useEffect(() => {
        let timer;
        if (countdown > 0) {
            timer = setTimeout(() => setCountdown(countdown - 1), 1000);
        }
        return () => clearTimeout(timer);
    }, [countdown]);

    const handleSendVerificationEmail = async () => {
        setError('');
        setSuccess('');
        if (!email.value) {
            setError('이메일을 입력해주세요.');
            return;
        }

        try {
            // First, check email duplication
            const emailDuplicationResponse = await checkEmailDuplication(email.value);
            if (!emailDuplicationResponse.isUnique) {
                setError('이미 사용 중인 이메일입니다.');
                setIsEmailUnique(false);
                return;
            }
            setIsEmailUnique(true);

            // If email is unique, send verification email
            await sendVerificationEmail(email.value);
            setEmailSent(true);
            setCountdown(180); // 3 minutes
            setSuccess('인증 코드가 이메일로 전송되었습니다.');
        } catch (err) {
            setError(err.response?.data?.message || '이메일 확인 및 인증 코드 전송 실패');
        }
    };

    const handleVerifyEmailCode = async () => {
        setError('');
        setSuccess('');
        if (!email.value || !verificationCode.value) {
            setError('이메일과 인증 코드를 모두 입력해주세요.');
            return;
        }
        try {
            const response = await verifyEmailCode(email.value, verificationCode.value);
            if (response.isVerified) {
                setEmailVerified(true);
                setSuccess('이메일이 성공적으로 인증되었습니다.');
            } else {
                setError('인증 코드가 일치하지 않습니다.');
            }
        } catch (err) {
            setError(err.response?.data?.message || '인증 코드 확인 실패');
        }
    };

    const handleCheckIdDuplication = async () => {
        setError('');
        setSuccess('');
        if (!id.value) {
            setError('아이디를 입력해주세요.');
            return;
        }
        try {
            const response = await checkIdDuplication(id.value);
            if (response.isUnique) {
                setIsIdUnique(true);
                setSuccess('사용 가능한 아이디입니다.');
            } else {
                setIsIdUnique(false);
                setError('이미 사용 중인 아이디입니다.');
            }
        } catch (err) {
            setError(err.response?.data?.message || '아이디 중복 확인 실패');
        }
    };

    const handleCheckNicknameDuplication = async () => {
        setError('');
        setSuccess('');
        if (!nickname.value) {
            setError('닉네임을 입력해주세요.');
            return;
        }
        try {
            const response = await checkNicknameDuplication(nickname.value);
            if (response.isUnique) {
                setIsNicknameUnique(true);
                setSuccess('사용 가능한 닉네임입니다.');
            } else {
                setIsNicknameUnique(false);
                setError('이미 사용 중인 닉네임입니다.');
            }
        } catch (err) {
            setError(err.response?.data?.message || '닉네임 중복 확인 실패');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (password.value !== confirmPassword.value) {
            setError('비밀번호가 일치하지 않습니다.');
            return;
        }

        if (!isIdUnique) {
            setError('아이디 중복 확인을 완료해주세요.');
            return;
        }

        if (!emailVerified) {
            setError('이메일 인증을 완료해주세요.');
            return;
        }

        if (!isNicknameUnique) {
            setError('닉네임 중복 확인을 완료해주세요.');
            return;
        }

        try {
            const response = await signup({
                userId: id.value,
                userEmail: email.value,
                userPassword: password.value,
                userNickname: nickname.value,
            });
            setSuccess('회원가입 성공! 로그인 페이지로 이동합니다.');
            // Optionally log in the user immediately after signup
            // await login(email.value, password.value);
            setTimeout(() => {
                navigate('/signin');
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || '회원가입 실패');
        }
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.header}>회원가입</h2>
            <form onSubmit={handleSubmit} style={styles.form}>
                {error && <p style={styles.error}>{error}</p>}
                {success && <p style={styles.success}>{success}</p>}

                <div style={styles.formGroup}>
                    <label htmlFor="id" style={styles.label}>아이디:</label>
                    <div style={styles.inputWithButton}>
                        <input
                            type="text"
                            id="id"
                            {...id}
                            required
                            style={styles.input}
                            onChange={(e) => { id.onChange(e); setIsIdUnique(false); }}
                        />
                        <button
                            type="button"
                            onClick={handleCheckIdDuplication}
                            disabled={!id.value || isIdUnique}
                            style={styles.checkButton}
                        >
                            {isIdUnique ? '확인 완료' : '중복 확인'}
                        </button>
                    </div>
                </div>

                <div style={styles.formGroup}>
                    <label htmlFor="email" style={styles.label}>이메일:</label>
                    <div style={styles.inputWithButton}>
                        <input
                            type="email"
                            id="email"
                            {...email}
                            required
                            style={styles.input}
                            disabled={emailSent}
                            onChange={(e) => { email.onChange(e); setIsEmailUnique(false); setEmailSent(false); setEmailVerified(false); setCountdown(0); }}
                        />
                        <button
                            type="button"
                            onClick={handleSendVerificationEmail}
                            disabled={!email.value || emailSent}
                            style={styles.sendCodeButton}
                        >
                            {emailSent && countdown > 0 ? `재전송 (${countdown}s)` : '인증 코드 전송'}
                        </button>
                    </div>
                </div>

                {emailSent && (
                    <div style={styles.formGroup}>
                        <label htmlFor="emailVerification" style={styles.label}>인증 코드:</label>
                        <div style={styles.inputWithButton}>
                            <input
                                type="text"
                                id="emailVerification"
                                {...verificationCode}
                                required
                                style={styles.input}
                                disabled={emailVerified}
                            />
                            <button
                                type="button"
                                onClick={handleVerifyEmailCode}
                                disabled={emailVerified || !emailSent}
                                style={styles.verifyCodeButton}
                            >
                                {emailVerified ? '인증 완료' : '코드 확인'}
                            </button>
                        </div>
                    </div>
                )}

                <div style={styles.formGroup}>
                    <label htmlFor="password" style={styles.label}>비밀번호:</label>
                    <input
                        type="password"
                        id="password"
                        {...password}
                        required
                        style={styles.input}
                    />
                </div>
                <div style={styles.formGroup}>
                    <label htmlFor="confirmPassword" style={styles.label}>비밀번호 확인:</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        {...confirmPassword}
                        required
                        style={styles.input}
                    />
                </div>


                <div style={styles.formGroup}>
                    <label htmlFor="nickname" style={styles.label}>닉네임:</label>
                    <div style={styles.inputWithButton}>
                        <input
                            type="text"
                            id="nickname"
                            {...nickname}
                            required
                            style={styles.input}
                            onChange={(e) => { nickname.onChange(e); setIsNicknameUnique(false); }}
                        />
                        <button
                            type="button"
                            onClick={handleCheckNicknameDuplication}
                            disabled={!nickname.value || isNicknameUnique}
                            style={styles.checkButton}
                        >
                            {isNicknameUnique ? '확인 완료' : '중복 확인'}
                        </button>
                    </div>
                </div>

                <button type="submit" style={styles.button} disabled={!emailVerified || !isIdUnique || !isNicknameUnique}>
                    회원가입
                </button>
            </form>
            <p style={styles.loginLink}>
                이미 계정이 있으신가요? <span onClick={() => navigate('/signin')} style={styles.link}>로그인</span>
            </p>
        </div>
    );
}

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#f0f2f5',
        padding: '20px',
    },
    header: {
        color: '#333',
        marginBottom: '30px',
    },
    form: {
        backgroundColor: '#fff',
        padding: '40px',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        width: '100%',
        maxWidth: '400px',
    },
    formGroup: {
        marginBottom: '20px',
    },
    label: {
        display: 'block',
        marginBottom: '8px',
        color: '#555',
        fontWeight: 'bold',
    },
    input: {
        flexGrow: 1,
        padding: '10px',
        border: '1px solid #ddd',
        borderRadius: '4px',
        fontSize: '16px',
    },
    inputWithButton: {
        display: 'flex',
        gap: '10px',
        alignItems: 'center',
    },
    sendCodeButton: {
        padding: '10px 15px',
        backgroundColor: '#28a745',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        fontSize: '14px',
        cursor: 'pointer',
        whiteSpace: 'nowrap',
    },
    verifyCodeButton: {
        padding: '10px 15px',
        backgroundColor: '#007bff',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        fontSize: '14px',
        cursor: 'pointer',
        whiteSpace: 'nowrap',
    },
    checkButton: {
        padding: '10px 15px',
        backgroundColor: '#ffc107',
        color: '#333',
        border: 'none',
        borderRadius: '4px',
        fontSize: '14px',
        cursor: 'pointer',
        whiteSpace: 'nowrap',
    },
    button: {
        width: '100%',
        padding: '12px',
        backgroundColor: '#007bff',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        fontSize: '18px',
        cursor: 'pointer',
        marginTop: '20px',
    },
    error: {
        color: 'red',
        marginBottom: '15px',
        textAlign: 'center',
    },
    success: {
        color: 'green',
        marginBottom: '15px',
        textAlign: 'center',
    },
    loginLink: {
        marginTop: '20px',
        color: '#555',
    },
    link: {
        color: '#007bff',
        cursor: 'pointer',
        textDecoration: 'underline',
    },
};

export default SignUp;