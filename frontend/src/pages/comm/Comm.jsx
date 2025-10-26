import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCommPosts } from './hook/useCommPosts';
import PostList from './components/PostList';
import PostDetail from './components/PostDetail';
import PostForm from './components/PostForm';
import LoadingSpinner from '../../common/components/LoadingSpinner';

function Comm() {
    const { postId } = useParams(); // Get postId from URL
    const navigate = useNavigate();
    const { posts, selectedPost, loading, error, fetchPosts, fetchPostById, addPost, editPost, removePost, setSelectedPost } = useCommPosts();
    const [showForm, setShowForm] = useState(false);
    const [editingPost, setEditingPost] = useState(null);

    useEffect(() => {
        if (postId) {
            fetchPostById(parseInt(postId));
        } else {
            setSelectedPost(null);
        }
    }, [postId, fetchPostById, setSelectedPost]);

    const handleViewDetail = (id) => {
        navigate(`/comm/${id}`); // Navigate to URL with postId
    };

    const handleCreateNewPost = () => {
        setEditingPost({});
        setShowForm(true);
        navigate('/comm'); // Clear postId from URL when creating new post
    };

    const handleEditPost = (post) => {
        setEditingPost(post);
        setShowForm(true);
        navigate(`/comm/${post.postId}`); // Keep postId in URL when editing
    };

    const handleDeletePost = async (id) => {
        if (window.confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
            await removePost(id);
            navigate('/comm'); // Go back to list after deleting
        }
    };

    const handleSubmitForm = async (postData) => {
        if (editingPost && editingPost.postId) {
            await editPost(editingPost.postId, postData);
        }
        else {
            await addPost(postData);
        }
        setShowForm(false);
        setEditingPost(null);
        navigate('/comm'); // Go back to list after submitting form
    };

    const handleCancelForm = () => {
        setShowForm(false);
        setEditingPost(null);
        navigate('/comm'); // Go back to list after canceling form
    };

    if (loading) return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <LoadingSpinner />
        </div>
    );
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
                <PostDetail 
                    post={selectedPost} 
                    onBackToList={() => navigate('/comm')} 
                    onEdit={handleEditPost} 
                    onDelete={handleDeletePost} 
                />
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
