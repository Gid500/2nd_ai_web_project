import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PostForm from './components/PostForm';
import LoadingSpinner from '../../common/components/LoadingSpinner';
import useCommPage from './hook/useCommPage';

function EditPostPage() {
    const { postId } = useParams();
    const navigate = useNavigate();
    const {
        editingPostData,
        loading,
        error,
        handleSubmitForm,
        handleCancelForm,
    } = useCommPage();

    useEffect(() => {
        // If editingPostData is null after loading, it means the post was not found or an error occurred.
        // In a real application, you might want to redirect to a 404 page or show an error message.
        if (!loading && !editingPostData && postId) {
            // Optionally redirect to a 404 or error page
            // navigate('/404');
            console.error('Post not found for editing:', postId);
        }
    }, [loading, editingPostData, postId, navigate]);

    if (loading) return (
        <div className="comm-loading-spinner-container">
            <LoadingSpinner />
        </div>
    );
    if (error) return <p>에러 발생: {error.message}</p>;

    return (
        <div className="comm-container">
            <h1 className="comm-header">게시글 수정</h1>
            <PostForm
                onSubmit={handleSubmitForm}
                initialData={editingPostData}
                onCancel={handleCancelForm}
            />
        </div>
    );
}

export default EditPostPage;
