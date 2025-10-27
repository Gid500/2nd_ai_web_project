import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useInput from '../../../common/hook/useInput';
import { useSignupApi } from '../api/signupApi';
import { useAuth } from '../../../common/hook/AuthProvider';

const useSignUp = () => {
    const navigate = useNavigate();
    const { signup, sendVerificationEmail, verifyEmailCode, checkEmailDuplication, checkNicknameDuplication, checkIdDuplication } = useSignupApi();
    const { login } = useAuth();

    const id = useInput('');
    const email = useInput('');
    const password = useInput('');
    const confirmPassword = useInput('');
    const nickname = useInput('');
    const verificationCode = useInput('');

    const [idError, setIdError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [nicknameError, setNicknameError] = useState('');
    const [generalError, setGeneralError] = useState('');

    const [success, setSuccess] = useState('');
    const [emailVerificationMessage, setEmailVerificationMessage] = useState('');
    const [idVerificationMessage, setIdVerificationMessage] = useState('');
    const [nicknameVerificationMessage, setNicknameVerificationMessage] = useState('');
    const [emailSent, setEmailSent] = useState(false);
    const [emailVerified, setEmailVerified] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const [isIdUnique, setIsIdUnique] = useState(false);
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
            } else {
                setPasswordMatchMessage({ message: '비밀번호가 일치하지 않습니다.', type: 'error' });
            }
        } else {
            setPasswordMatchMessage({ message: '', type: '' });
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
                return;
            }

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

        setIdError('');
        setEmailError('');
        setNicknameError('');

        let hasError = false;

        if (password.value !== confirmPassword.value) {
            setPasswordMatchMessage({ message: '비밀번호가 일치하지 않습니다.', type: 'error' });
            hasError = true;
        } else {
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
            if (response.status === 200) {
                setSuccess('회원가입 성공! 자동으로 로그인됩니다.');
                await login();
                setTimeout(() => {
                    navigate('/');
                }, 2000);
            }
        } catch (err) {
            setGeneralError(err.response?.data?.message || '회원가입 실패');
        }
    };

    return {
        id,
        email,
        password,
        confirmPassword,
        nickname,
        verificationCode,
        idError,
        emailError,
        nicknameError,
        generalError,
        success,
        emailVerificationMessage,
        idVerificationMessage,
        nicknameVerificationMessage,
        emailSent,
        emailVerified,
        countdown,
        isIdUnique,
        isNicknameUnique,
        passwordMatchMessage,
        handleSendVerificationEmail,
        handleVerifyEmailCode,
        handleCheckIdDuplication,
        handleCheckNicknameDuplication,
        handleSubmit,
        navigate, // navigate도 훅에서 반환하여 컴포넌트에서 사용할 수 있도록 합니다.
        login, // login 함수도 훅에서 반환하여 컴포넌트에서 사용할 수 있도록 합니다.
        setEmailSent, // setEmailSent도 훅에서 반환하여 컴포넌트에서 사용할 수 있도록 합니다.
        setEmailVerified, // setEmailVerified도 훅에서 반환하여 컴포넌트에서 사용할 수 있도록 합니다.
        setCountdown, // setCountdown도 훅에서 반환하여 컴포넌트에서 사용할 수 있도록 합니다.
        setIsIdUnique, // setIsIdUnique도 훅에서 반환하여 컴포넌트에서 사용할 수 있도록 합니다.
        setIsNicknameUnique, // setIsNicknameUnique도 훅에서 반환하여 컴포넌트에서 사용할 수 있도록 합니다.
        setIdVerificationMessage, // setIdVerificationMessage도 훅에서 반환하여 컴포넌트에서 사용할 수 있도록 합니다.
        setIdError, // setIdError도 훅에서 반환하여 컴포넌트에서 사용할 수 있도록 합니다.
        setEmailError, // setEmailError도 훅에서 반환하여 컴포넌트에서 사용할 수 있도록 합니다.
        setNicknameVerificationMessage, // setNicknameVerificationMessage도 훅에서 반환하여 컴포넌트에서 사용할 수 있도록 합니다.
        setNicknameError, // setNicknameError도 훅에서 반환하여 컴포넌트에서 사용할 수 있도록 합니다.
        setEmailVerificationMessage, // setEmailVerificationMessage도 훅에서 반환하여 컴포넌트에서 사용할 수 있도록 합니다.
    };
};

export default useSignUp;
