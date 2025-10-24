import React, { useState } from 'react';
import { useCommPosts } from './hook/useCommPosts';
import PostList from './components/PostList';
import PostDetail from './components/PostDetail';
import PostForm from './components/PostForm';

function Comm() {
    const { posts, selectedPost, loading, error, fetchPosts, fetchPostById, addPost, editPost, removePost, setSelectedPost } = useCommPosts();
    const [showForm, setShowForm] = useState(false);
    const [editingPost, setEditingPost] = useState(null);

    const handleViewDetail = (postId) => {
        fetchPostById(postId);
    };

    const handleCreateNewPost = () => {
        setEditingPost({}); // Revert to empty object
        setShowForm(true);
    };

    const handleEditPost = (post) => {
        setEditingPost(post);
        setShowForm(true);
    };

    const handleDeletePost = async (postId) => {
        if (window.confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
            await removePost(postId);
        }
    };

    const handleSubmitForm = async (postData) => {
        if (editingPost && editingPost.postId) { // Check if editingPost and postId exist for edit mode
            await editPost(editingPost.postId, postData);
        } else {
            await addPost(postData);
        }
        setShowForm(false);
        setEditingPost(null);
    };

    const handleCancelForm = () => {
        setShowForm(false);
        setEditingPost(null);
    };

    if (loading) return <p>로딩 중...</p>;
    if (error) return <p>에러 발생: {error.message}</p>;

    return (
        <div>
            <h1>커뮤니티 게시판</h1>

            {!showForm && !selectedPost && (
                <button onClick={handleCreateNewPost}>새 게시글 작성</button>
            )}

            {showForm ? (
                <PostForm
                    onSubmit={handleSubmitForm}
                    initialData={editingPost}
                    onCancel={handleCancelForm}
                />
            ) : selectedPost ? (
                <PostDetail post={selectedPost} onBackToList={() => setSelectedPost(null)} />
            ) : (
                <PostList
                    posts={posts}
                    onViewDetail={handleViewDetail}
                    onEdit={handleEditPost}
                    onDelete={handleDeletePost}
                />
            )}
        </div>
    );
}

export default Comm;
