import React from 'react';
import { useNavigate } from 'react-router-dom';
import useInput from '../../../common/hook/useInput';
import { useAuth } from '../../../common/hook/AuthProvider';
import { signIn } from '../api/signinApi'; // 새로 생성한 API 함수 임포트

const useSignIn = () => {
    const identifier = useInput('');
    const password = useInput('');
    const [error, setError] = React.useState(null);
    const [loading, setLoading] = React.useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const response = await signIn(identifier.value, password.value);
            if (response.status === 200) {
                alert('로그인 성공!');
                await login();
                navigate('/');
            }
        } catch (err) {
            setError(err.response?.data?.message || err.message);
            alert('로그인 실패: ' + (err.response?.data?.message || err.message));
        } finally {
            setLoading(false);
        }
    };

    return {
        identifier,
        password,
        error,
        loading,
        handleLogin,
    };
};

export default useSignIn;
