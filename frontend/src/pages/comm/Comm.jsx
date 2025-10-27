import React from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom'; // useLocation 추가
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
    const { postId } = useParams(); // postId만 가져옴
    const navigate = useNavigate();
    const location = useLocation(); // useLocation 훅 사용
    const { user, isAdmin } = useAuth();

    const isNewPost = location.pathname === '/comm/new';
    const isEditPost = location.pathname.endsWith('/edit');

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
    if (isNewPost || (isEditPost && postId)) {
        return (
            <div className="comm-container">
                <h1 className="comm-header">{isNewPost ? '새 게시글 작성' : '게시글 수정'}</h1>
                <PostForm
                    onSubmit={handleSubmitForm}
                    initialData={isEditPost ? editingPostData : {}}
                    onCancel={handleCancelForm}
                />
            </div>
        );
    }

    // 게시글 상세 보기 렌더링
    if (postId) {
        if (!currentPostDetail) {
            return (
                <div className="comm-loading-spinner-container">
                    <LoadingSpinner />
                </div>
            );
        }
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
