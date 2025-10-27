import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import PostList from './components/PostList';
import PostDetail from './components/PostDetail';
import LoadingSpinner from '../../common/components/LoadingSpinner';
import Pagination from './components/Pagination';
import NoticeSection from './components/NoticeSection';
import useCommPage from './hook/useCommPage';
import { useAuth } from '../../common/hook/AuthProvider';
import './Comm.css';

function Comm() {
    const { postId } = useParams(); // postId만 URL에서 가져옴
    const navigate = useNavigate();
    const { user, isAdmin } = useAuth();
    const [searchParams, setSearchParams] = useSearchParams();

    const [searchType, setSearchType] = useState(searchParams.get('searchType') || 'title');
    const [searchKeyword, setSearchKeyword] = useState(searchParams.get('searchKeyword') || '');

    const {
        posts,
        notices,
        currentPostDetail,
        comments,
        fetchCommentsForPost,
        loading,
        error,
        totalPosts,
        currentPage,
        postsPerPage,
        handleViewDetail,
        handleCreateNewPost,
        handleDeletePost,
        paginate,
        handlePostsPerPageChange,
        setCurrentPage,
        setPostsPerPage
    } = useCommPage();

    useEffect(() => {
        const page = parseInt(searchParams.get('page')) || 1;
        const size = parseInt(searchParams.get('size')) || 10;
        const type = searchParams.get('searchType') || 'title';
        const keyword = searchParams.get('searchKeyword') || '';

        setCurrentPage(page);
        setPostsPerPage(size);
        setSearchType(type);
        setSearchKeyword(keyword);
    }, [searchParams, setCurrentPage, setPostsPerPage]);

    // searchType이 변경될 때 searchKeyword 초기화
    useEffect(() => {
        setSearchKeyword('');
    }, [searchType]);

    const handleSearch = (e) => {
        e.preventDefault();
        const newSearchParams = new URLSearchParams();
        if (searchType) newSearchParams.set('searchType', searchType);
        if (searchKeyword) {
            newSearchParams.set('searchKeyword', searchKeyword);
        }
        newSearchParams.set('page', 1); // 검색 시 1페이지로 리셋
        newSearchParams.set('size', postsPerPage);
        setSearchParams(newSearchParams);
        setCurrentPage(1);
    };

    if (loading) return (
        <div className="comm-loading-spinner-container">
            <LoadingSpinner />
        </div>
    );
    if (error) return <p>에러 발생: {error.message}</p>;

    // 게시글 상세 보기 렌더링
    if (postId) {
        return (
            <div className="comm-container">
                <h1 className="comm-header">게시글 상세</h1>
                <PostDetail
                    post={currentPostDetail}
                    onBackToList={() => navigate('/comm')}
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

            <div className="comm-search-section">
                <form onSubmit={handleSearch} className="comm-search-form">
                    <select value={searchType} onChange={(e) => setSearchType(e.target.value)} className="comm-search-select">
                        <option value="title">제목</option>
                        <option value="content">내용</option>
                        <option value="title_content">제목 + 내용</option>
                        <option value="userId">작성자 ID</option>
                    </select>
                    <input
                        type="text"
                        value={searchKeyword}
                        onChange={(e) => setSearchKeyword(e.target.value)}
                        placeholder={searchType === 'userId' ? "작성자 ID를 입력하세요" : "검색어를 입력하세요"}
                        className="comm-search-input"
                    />
                    <button type="submit" className="comm-search-button">검색</button>
                </form>
            </div>

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
                searchParams={searchParams}
            />
        </div>
    );
}

export default Comm;
