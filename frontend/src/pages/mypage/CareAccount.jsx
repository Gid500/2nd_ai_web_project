import React, { useState } from 'react';
import Mypagetab from '../../common/Mypagetab';
import './Mypage.css'; // Import Mypage.css for styling
import { useAuth } from '../../common/hook/useAuth';
import { useNavigate } from 'react-router-dom';
import api from '../../common/api/api';

function CareAccoount() {
    const { userId, logout } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [step, setStep] = useState(1); // 1: Request code, 2: Confirm deletion
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

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

    return (
        <div className="careAccountContainer">
            <Mypagetab />
            <div className="careAccountContent">
                <h2 className="pf-title">계정 관리</h2>
                <p>이곳에서 계정 관련 설정을 관리할 수 있습니다.</p>

                {error && <div className="pf-error">{error}</div>}
                {success && <div className="pf-success">{success}</div>}

                {step === 1 && (
                    <div className="pf-row">
                        <label htmlFor="deleteEmail" className="pf-label">이메일</label>
                        <input
                            id="deleteEmail"
                            className="pf-input"
                            type="email"
                            placeholder="계정 삭제를 위한 이메일 입력"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <button className="pf-submit" onClick={handleRequestCode} disabled={loading}>
                            {loading ? '전송 중...' : '인증 코드 요청'}
                        </button>
                    </div>
                )}

                {step === 2 && (
                    <div className="pf-row">
                        <label htmlFor="verificationCode" className="pf-label">인증 코드</label>
                        <input
                            id="verificationCode"
                            className="pf-input"
                            type="text"
                            placeholder="이메일로 받은 인증 코드"
                            value={verificationCode}
                            onChange={(e) => setVerificationCode(e.target.value)}
                            required
                        />
                        <button className="pf-submit delete-button" onClick={handleConfirmDeletion} disabled={loading}>
                            {loading ? '삭제 중...' : '계정 삭제 확인'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default CareAccoount;