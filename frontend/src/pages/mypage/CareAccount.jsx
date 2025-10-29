import React, { useState, useEffect, useRef } from 'react';
import Mypagetab from '../../common/Mypagetab';
import './Mypage.css'; // Import Mypage.css for styling
import { useAuth } from '../../common/hook/useAuth';
import { useNavigate } from 'react-router-dom';
import api from '../../common/api/api';
import PasswordResetForm from './components/PasswordResetForm';

function CareAccoount() {
    const { userId, logout } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [step, setStep] = useState(1); // 1: Request code, 2: Confirm deletion
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // 카운트다운 관련 상태
    const [countdown, setCountdown] = useState(0); // 남은 시간 (초)
    const [isCounting, setIsCounting] = useState(false); // 카운트다운 진행 여부
    const countdownRef = useRef(null); // setInterval ID 저장

    useEffect(() => {
        // userId가 변경될 때마다 상태를 초기화합니다.
        setEmail('');
        setVerificationCode('');
        setStep(1);
        setError('');
        setSuccess('');
        setCountdown(0); // 카운트다운 초기화
        setIsCounting(false); // 카운트다운 중지
        if (countdownRef.current) {
            clearInterval(countdownRef.current);
        }

        const fetchUserEmail = async () => {
            if (!userId) {
                setError('사용자 정보를 불러올 수 없습니다. 로그인 상태를 확인해주세요.');
                return;
            }
            try {
                const response = await api.get('/api/mypage/user/' + userId);
                setEmail(response.data.userEmail); // 사용자의 이메일을 기본값으로 설정
            } catch (err) {
                console.error("Failed to fetch user email:", err);
                if (err.response && err.response.status === 403) {
                    setError('프로필 정보를 조회할 권한이 없습니다. 다시 로그인해주세요.');
                } else {
                    setError('사용자 이메일을 불러오는데 실패했습니다.');
                }
            }
        };
        fetchUserEmail();
    }, [userId]);

    // 카운트다운 로직
    useEffect(() => {
        if (isCounting && countdown > 0) {
            countdownRef.current = setInterval(() => {
                setCountdown(prev => prev - 1);
            }, 1000);
        } else if (countdown === 0) {
            setIsCounting(false);
            if (countdownRef.current) {
                clearInterval(countdownRef.current);
            }
        }
        return () => {
            if (countdownRef.current) {
                clearInterval(countdownRef.current);
            }
        };
    }, [isCounting, countdown]);

    const handleRequestCode = async () => {
        if (!userId) {
            setError('사용자 정보를 찾을 수 없습니다.');
            return;
        }
        if (!email) {
            setError('이메일을 입력해주세요.');
            return;
        }

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            await api.post('/api/mypage/delete-account/request-code', { userEmail: email });
            setSuccess('인증 코드가 이메일로 전송되었습니다.');
            setStep(2);
            // 카운트다운 시작 (예: 3분 = 180초)
            setCountdown(180); 
            setIsCounting(true);
        } catch (err) {
            console.error("Error requesting deletion code:", err);
            setError(err.response?.data || '인증 코드 전송에 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const handleConfirmDeletion = async () => {
        if (!userId) {
            setError('사용자 정보를 찾을 수 없습니다.');
            return;
        }
        if (!email || !verificationCode) {
            setError('이메일과 인증 코드를 모두 입력해주세요.');
            return;
        }

        if (!window.confirm('정말로 계정을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
            return;
        }

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            await api.delete(`/api/mypage/delete-account/${userId}?emailCode=${verificationCode}`);
            setSuccess('계정이 성공적으로 삭제되었습니다.');
            logout();
            navigate('/signin');
        } catch (err) {
            console.error("Error deleting account:", err);
            setError(err.response?.data || '계정 삭제 중 오류가 발생했습니다. 다시 시도해주세요.');
        } finally {
            setLoading(false);
        }
    };

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    };

    return (
        <div className="mypage-content-wrapper">
            <Mypagetab />
            <div className="mypage-profile-form">
                <h2 className="mypage-title">계정 관리</h2>
                
                <p>이곳에서 계정 관련 설정을 관리할 수 있습니다.</p>
                
                <br/>
                <br/>

                <h2 className="mypage-title">계정 삭제</h2>
                {error && <div className="mypage-error">{error}</div>}
                {success && <div className="mypage-success">{success}</div>}

                {step === 1 && (
                    <div className="mypage-row">
                        <label htmlFor="deleteEmail" className="mypage-label">이메일</label>
                        <div className="mypage-input-button-group">
                            <input
                                id="deleteEmail"
                                className="mypage-input"
                                type="email"
                                placeholder="계정 삭제를 위한 이메일 입력"
                                value={email}
                                readOnly // readonly 속성 추가
                            />
                            <button 
                                className="mypage-submit"
                                onClick={handleRequestCode}
                                disabled={loading || isCounting} // 로딩 중이거나 카운트다운 중일 때 비활성화
                            >
                                {loading ? '전송 중...' : (isCounting ? `재전송 (${formatTime(countdown)})` : '인증 코드 요청')}
                            </button>
                        </div>
                    </div>
                )}
                <br/>
                {step === 2 && (
                    <div className="mypage-row">
                        <label htmlFor="verificationCode" className="mypage-label">인증 코드</label>
                        <div className="mypage-input-button-group">
                            <input
                                id="verificationCode"
                                className="mypage-input"
                                type="text"
                                placeholder="이메일로 받은 인증 코드"
                                value={verificationCode}
                                onChange={(e) => setVerificationCode(e.target.value)}
                                required
                            />
                            <button className="mypage-submit mypage-delete" onClick={handleConfirmDeletion} disabled={loading}>
                                {loading ? '삭제 중...' : '계정 삭제 확인'}
                            </button>
                        </div>
                    </div>
                )}

                <PasswordResetForm />
            </div>
        </div>
    );
}

export default CareAccoount;