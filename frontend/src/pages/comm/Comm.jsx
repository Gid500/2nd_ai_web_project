import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCommPosts } from './hook/useCommPosts';
import PostList from './components/PostList';
import PostDetail from './components/PostDetail';
import PostForm from './components/PostForm';
import LoadingSpinner from '../../common/components/LoadingSpinner';

// 페이지네이션 컴포넌트 (임시로 여기에 정의, 나중에 별도 파일로 분리 가능)
const Pagination = ({ postsPerPage, totalPosts, paginate, currentPage }) => {
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
        pageNumbers.push(i);
    }

    return (
        <nav>
            <ul className='pagination'>
                {pageNumbers.map(number => (
                    <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
                        <a onClick={() => paginate(number)} href='!#' className='page-link'>
                            {number}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
};


function Comm() {
    const { postId } = useParams();
    const navigate = useNavigate();

    // 페이지네이션 상태 추가
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage, setPostsPerPage] = useState(10); // 기본값 10개

    // showForm과 editingPost 상태 추가
    const [showForm, setShowForm] = useState(false);
    const [editingPost, setEditingPost] = useState(null);

    const { 
        posts,
        selectedPost,
        loading,
        error,
        fetchPosts,
        fetchPostById,
        addPost,
        editPost,
        removePost,
        setSelectedPost,
        totalPosts // useCommPosts 훅에서 totalPosts를 받아옴
    } = useCommPosts(currentPage, postsPerPage); // 훅에 페이지네이션 파라미터 전달

    useEffect(() => {
        if (postId) {
            fetchPostById(parseInt(postId));
        } else {
            setSelectedPost(null);
            fetchPosts(); // 페이지네이션 파라미터가 변경될 때마다 게시물 목록 다시 불러오기
        }
    }, [postId, fetchPostById, setSelectedPost, fetchPosts, currentPage, postsPerPage]); // 의존성 배열에 추가

    const handleViewDetail = (id) => {
        navigate(`/comm/${id}`);
    };

    const handleCreateNewPost = () => {
        setEditingPost({});
        setShowForm(true);
        navigate('/comm');
    };

    const handleEditPost = (post) => {
        setEditingPost(post);
        setShowForm(true);
        navigate(`/comm/${post.postId}`);
    };

    const handleDeletePost = async (id) => {
        if (window.confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
            await removePost(id);
            navigate('/comm');
            fetchPosts(); // 삭제 후 목록 새로고침
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
        navigate('/comm');
        fetchPosts(); // 제출 후 목록 새로고침
    };

    const handleCancelForm = () => {
        setShowForm(false);
        setEditingPost(null);
        navigate('/comm');
    };

    // 페이지 변경 핸들러
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // 페이지당 게시물 개수 변경 핸들러
    const handlePostsPerPageChange = (e) => {
        setPostsPerPage(parseInt(e.target.value));
        setCurrentPage(1); // 페이지당 게시물 개수 변경 시 1페이지로 초기화
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
                <>
                    <div style={{ marginBottom: '10px' }}>
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

