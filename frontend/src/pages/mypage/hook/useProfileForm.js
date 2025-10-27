import { useRef, useState, useEffect } from 'react';
import { fetchUserProfile, updateNickname, uploadProfileImage } from '../api/mypageApi';
import { deleteUser, sendVerificationEmail, verifyEmailCode } from '../../../common/api/userApi'; // deleteUser, sendVerificationEmail, verifyEmailCode 임포트
import { useAuth } from '../../../common/hook/AuthProvider'; // useAuth 임포트
import { useNavigate } from 'react-router-dom'; // useNavigate 임포트

const useProfileForm = (userId) => {
    const fileRef = useRef(null);
    const { logout } = useAuth(); // useAuth 훅에서 logout 함수 가져오기
    const navigate = useNavigate(); // useNavigate 훅 사용

    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [nickname, setNickname] = useState('');

    const [error, setError] = useState('');
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState('');

    // 이메일 인증 관련 상태
    const [showEmailVerification, setShowEmailVerification] = useState(false);
    const [verificationEmail, setVerificationEmail] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [emailSent, setEmailSent] = useState(false);
    const [emailVerified, setEmailVerified] = useState(false);
    const [emailVerificationError, setEmailVerificationError] = useState('');

    useEffect(() => {
        const loadUserData = async () => {
            if (!userId) return;
            try {
                const data = await fetchUserProfile(userId);
                setNickname(data.userNickname);
                setAvatarPreview(data.userImgUrl);
                setVerificationEmail(data.userEmail); // 사용자 이메일 설정
            } catch (err) {
                console.error("Failed to fetch user data:", err);
                setError("Failed to load user data.");
            }
        };
        loadUserData();
    }, [userId]);

    const onPickFile = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const validTypes = ['image/png', 'image/jpeg', 'image/webp', 'image/gif'];
        if (!validTypes.includes(file.type)) {
            setError('PNG/JPG/WebP/GIF 파일만 업로드할 수 있어요.');
            e.target.value = '';
            return;
        }
        const maxSizeMB = 5;
        if (file.size > maxSizeMB * 1024 * 1024) {
            setError(`파일이 너무 커요. ${maxSizeMB}MB 이하로 올려주세요.`);
            e.target.value = '';
            return;
        }

        setError('');
        setAvatarFile(file);

        const reader = new FileReader();
        reader.onload = () => setAvatarPreview(reader.result);
        reader.readAsDataURL(file);
    };

    const clearAvatar = () => {
        setAvatarFile(null);
        setAvatarPreview(null);
        if (fileRef.current) fileRef.current.value = '';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setSaving(true);

        try {
            if (userId && nickname) {
                await updateNickname(userId, nickname);
            }

            if (avatarFile && userId) {
                const formData = new FormData();
                formData.append('file', avatarFile);
                const data = await uploadProfileImage(userId, formData);
                setAvatarPreview(data.userImgUrl);
            }

            setSuccess('프로필이 저장되었어요!');
        } catch (err) {
            console.error("Error saving profile:", err);
            setError(err.response?.data || '저장 중 문제가 발생했어요.');
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (window.confirm('정말로 회원 탈퇴를 하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
            setShowEmailVerification(true); // 이메일 인증 UI 표시
            setEmailVerificationError('');
            setEmailSent(false);
            setEmailVerified(false);
            setVerificationCode('');
        }
    };

    const sendVerificationEmailRequest = async () => {
        setEmailVerificationError('');
        try {
            await sendVerificationEmail(verificationEmail);
            setEmailSent(true);
            alert('인증 코드가 이메일로 발송되었습니다.');
        } catch (err) {
            console.error("Error sending verification email:", err);
            setEmailVerificationError(err.response?.data || '인증 이메일 발송에 실패했습니다.');
        }
    };

    const verifyEmailCodeRequest = async () => {
        setEmailVerificationError('');
        try {
            const response = await verifyEmailCode(verificationEmail, verificationCode);
            if (response) {
                setEmailVerified(true);
                alert('이메일 인증이 완료되었습니다. 회원 탈퇴를 진행합니다.');
                // 이메일 인증 성공 후 실제 회원 탈퇴 로직 실행
                try {
                    await deleteUser(userId);
                    alert('회원 탈퇴가 완료되었습니다.');
                    logout(); // 로그아웃 처리
                    navigate('/signin'); // 로그인 페이지로 리다이렉트
                } catch (err) {
                    console.error("Error deleting account after verification:", err);
                    setEmailVerificationError(err.response?.data || '회원 탈퇴 중 문제가 발생했어요.');
                }
            }
        } catch (err) {
            console.error("Error verifying email code:", err);
            setEmailVerificationError(err.response?.data || '인증 코드 확인에 실패했습니다. 코드를 다시 확인해주세요.');
        }
    };

    return {
        fileRef,
        avatarFile,
        setAvatarFile,
        avatarPreview,
        setAvatarPreview,
        nickname,
        setNickname,
        error,
        setError,
        saving,
        setSaving,
        success,
        setSuccess,
        onPickFile,
        clearAvatar,
        handleSubmit,
        handleDeleteAccount,
        // 이메일 인증 관련 반환 값
        showEmailVerification,
        setShowEmailVerification,
        verificationEmail,
        setVerificationEmail,
        verificationCode,
        setVerificationCode,
        emailSent,
        emailVerified,
        emailVerificationError,
        sendVerificationEmailRequest,
        verifyEmailCodeRequest,
    };
};

export default useProfileForm;
