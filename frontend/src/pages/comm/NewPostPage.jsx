import React from 'react';
import { useNavigate } from 'react-router-dom';
import PostForm from './components/PostForm';
import useCommPage from './hook/useCommPage';
import LoadingSpinner from '../../common/components/LoadingSpinner';
import './Comm.css'; // Comm.css를 가져와서 스타일을 공유합니다.

function NewPostPage() {
    const navigate = useNavigate();
    const {
        handleSubmitForm,
        handleCancelForm,
        loading,
        error,
    } = useCommPage(); // useCommPage 훅을 사용하여 폼 제출 및 취소 로직을 가져옵니다.

    if (loading) return (
        <div className="comm-loading-spinner-container">
            <LoadingSpinner />
        </div>
    );
    if (error) return <p>에러 발생: {error.message}</p>;

    const handleFormSubmit = async (formData) => {
        await handleSubmitForm(formData);
        navigate('/comm'); // 제출 후 목록 페이지로 이동
    };

    const handleFormCancel = () => {
        handleCancelForm();
        navigate('/comm'); // 취소 후 목록 페이지로 이동
    };

    return (
        <div className="comm-container">
            <h1 className="comm-header">새 게시글 작성</h1>
            <PostForm
                onSubmit={handleFormSubmit}
                onCancel={handleFormCancel}
                initialData={{}} // 새 게시글이므로 초기 데이터는 비워둡니다.
            />
        </div>
    );
}

export default NewPostPage;
