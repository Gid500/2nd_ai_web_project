import React from 'react';
import { useParams } from 'react-router-dom';
import PostList from './components/PostList';
import PostDetail from './components/PostDetail';
import PostForm from './components/PostForm';
import LoadingSpinner from '../../common/components/LoadingSpinner';
import Pagination from './components/Pagination'; // 분리된 Pagination 컴포넌트 임포트
import NoticeSection from './components/NoticeSection'; // NoticeSection 컴포넌트 임포트
import useCommPage from './hook/useCommPage'; // 새로 생성한 훅 임포트
import './Comm.css'; // Comm.css 임포트

function Comm() {
    const { postId } = useParams();
    const {
        posts,
        notices,
        selectedPost,
        loading,
        error,
        totalPosts,
        currentPage,
        postsPerPage,
        showForm,
        editingPost,
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

    return (
        <div className="comm-container">
            <h1 className="comm-header">커뮤니티 게시판</h1>

            {!showForm && !selectedPost && (
                <button className="comm-create-post-button" onClick={handleCreateNewPost}>새 게시글 작성</button>
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
                    onBackToList={() => handleCancelForm()} // navigate 대신 handleCancelForm 사용
                    onEdit={handleEditPost}
                    onDelete={handleDeletePost}
                />
            ) : (
                <> 
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
                        onEdit={handleEditPost}
                        onDelete={handleDeletePost}
                    />
                    <Pagination
                        postsPerPage={postsPerPage}
                        totalPosts={totalPosts}
                        paginate={paginate}
                        currentPage={currentPage}
                    />
                </>
            )}
        </div>
    );
}

export default Comm;
