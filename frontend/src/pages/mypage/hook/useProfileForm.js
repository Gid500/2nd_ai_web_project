import { useRef, useState, useEffect } from 'react';
import { fetchUserProfile, updateNickname, uploadProfileImage } from '../api/mypageApi';

const useProfileForm = (userId) => {
    const fileRef = useRef(null);

    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [nickname, setNickname] = useState('');

    const [error, setError] = useState('');
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const loadUserData = async () => {
            if (!userId) return;
            try {
                const data = await fetchUserProfile(userId);
                setNickname(data.userNickname);
                setAvatarPreview(data.userImgUrl);
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
    };
};

export default useProfileForm;
