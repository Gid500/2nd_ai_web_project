import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PostList from './components/PostList';
import PostDetail from './components/PostDetail';
import PostForm from './components/PostForm';
import LoadingSpinner from '../../common/components/LoadingSpinner';
import Pagination from './components/Pagination';
import NoticeSection from './components/NoticeSection';
import useCommPage from './hook/useCommPage';
import { useAuth } from '../../common/hook/AuthProvider';
import './Comm.css';

function Comm() {
    const { postId, action } = useParams(); // postId와 action (new, edit)을 URL에서 가져옴
    const navigate = useNavigate();
    const { user, isAdmin } = useAuth();

    const {
        posts,
        notices,
        currentPostDetail,
        editingPostData,
        comments,
        fetchCommentsForPost,
        loading,
        error,
        totalPosts,
        currentPage,
        postsPerPage,
        handleViewDetail,
        handleCreateNewPost,
        handleEditPost,
        handleDeletePost,
        handleSubmitForm,
        handleCancelForm,
        paginate,
        handlePostsPerPageChange,
    } = useCommPage();

    if (loading) return (
        <div className="comm-loading-spinner-container">
            <LoadingSpinner />
        </div>
    );
    if (error) return <p>에러 발생: {error.message}</p>;

    // 게시글 작성/수정 폼 렌더링
    if (action === 'new' || (action === 'edit' && postId)) {
        return (
            <div className="comm-container">
                <h1 className="comm-header">{action === 'new' ? '새 게시글 작성' : '게시글 수정'}</h1>
                <PostForm
                    onSubmit={handleSubmitForm}
                    initialData={action === 'edit' ? editingPostData : null}
                    onCancel={handleCancelForm}
                />
            </div>
        );
    }

    // 게시글 상세 보기 렌더링
    if (postId) {
        return (
            <div className="comm-container">
                <h1 className="comm-header">게시글 상세</h1>
                <PostDetail
                    post={currentPostDetail}
                    onBackToList={() => navigate('/comm')}
                    onEdit={handleEditPost}
                    onDelete={handleDeletePost}
                    comments={comments}
                    fetchComments={fetchCommentsForPost}
                    isAdmin={isAdmin}
                />
            </div>
        );
    }

    // 게시글 목록 렌더링
    return (
        <div className="comm-container">
            <h1 className="comm-header">커뮤니티 게시판</h1>
            <NoticeSection notices={notices} onViewDetail={handleViewDetail} />
            <div className="comm-posts-per-page-selector">
                <label>페이지당 게시물 수:</label>
                <select value={postsPerPage} onChange={handlePostsPerPageChange}>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={40}>40</option>
                </select>
            </div>
            <PostList
                posts={posts}
                onViewDetail={handleViewDetail}
                onCreateNewPost={handleCreateNewPost}
                currentUser={user}
            />
            <Pagination
                postsPerPage={postsPerPage}
                totalPosts={totalPosts}
                paginate={paginate}
                currentPage={currentPage}
            />
        </div>
    );
}

export default Comm;
