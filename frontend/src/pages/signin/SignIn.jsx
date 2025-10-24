import React, { useEffect } from 'react';
import useInput from '../../common/hook/useInput';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../common/hook/AuthProvider'; // AuthProvider에서 useAuth 임포트
import api from './api/api'; // api 인스턴스 임포트

function SignIn() {
    const identifier = useInput('');
    const password = useInput('');
    const [error, setError] = React.useState(null);
    const [loading, setLoading] = React.useState(false);
    const navigate = useNavigate();
    const { login } = useAuth(); // useAuth 훅에서 login 함수 가져오기

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const response = await api.post('/api/login', {
                identifier: identifier.value,
                userPwd: password.value,
            });
            if (response.status === 200) {
                alert('로그인 성공!');
                login(); // 로그인 성공 시 AuthContext의 login 함수 호출
                navigate('/');
            }
        } catch (err) {
            setError(err.response?.data || err.message);
            alert('로그인 실패: ' + (err.response?.data || err.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>로그인</h2>
            <form onSubmit={handleLogin}>
                <div>
                    <label>아이디 또는 이메일:</label>
                    <input type="text" {...identifier} required />
                </div>
                <div>
                    <label>비밀번호:</label>
                    <input type="password" {...password} required />
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? '로그인 중...' : '로그인'}
                </button>
            </form>
        </div>
    );
}

export default SignIn;