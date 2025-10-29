import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useCommPosts } from './useCommPosts'; // useCommPosts 훅 임포트
import { getCommentsByPostId } from '../api/commCommentApi'; // 댓글 API 임포트 경로 수정

const useCommPage = () => {
    const { postId } = useParams(); // URL에서 postId만 가져옴
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage, setPostsPerPage] = useState(10);
    const [currentPostDetail, setCurrentPostDetail] = useState(null); // 상세 게시글 데이터를 저장할 상태
    const [editingPostData, setEditingPostData] = useState(null); // 수정할 게시글 데이터를 저장할 상태
    const [comments, setComments] = useState([]); // 댓글 목록 상태 추가

    const searchType = searchParams.get('searchType') || '';
    const searchKeyword = searchParams.get('searchKeyword') || '';

    const {
        posts,
        notices,
        loading,
        error,
        fetchPosts,
        fetchNotices,
        fetchPostById,
        addPost,
        editPost,
        removePost,
        totalPosts
    } = useCommPosts(currentPage, postsPerPage, searchType, searchKeyword);

    const fetchCommentsForPost = useCallback(async (id) => {
        try {
            const data = await getCommentsByPostId(id);
            setComments(data);
        } catch (err) {
            console.error('Error fetching comments:', err);
            setComments([]);
        }
    }, []);

    // postId가 변경될 때마다 상세 게시글 데이터와 댓글 데이터를 가져옴
    useEffect(() => {
        if (postId) {
            const getPostData = async () => {
                const post = await fetchPostById(parseInt(postId));
                // If we are on an edit page, set editingPostData
                // This logic is now primarily for EditPostPage to consume
                // Comm component will only set currentPostDetail
                if (window.location.pathname.includes('/edit')) {
                    setEditingPostData(post);
                } else {
                    setCurrentPostDetail(post);
                    fetchCommentsForPost(parseInt(postId));
                }
            };
            getPostData();
        } else {
            setCurrentPostDetail(null);
            setEditingPostData(null); // postId가 없으면 수정 데이터도 초기화
            setComments([]); // 댓글 목록 초기화
            fetchPosts();
            fetchNotices(2); // CommPage가 로드될 때 공지사항도 가져오도록 추가
        }
    }, [postId, fetchPostById, fetchCommentsForPost, fetchPosts, fetchNotices, currentPage, postsPerPage, searchType, searchKeyword]);

    const handleViewDetail = (id) => {
        navigate(`/comm/${id}`);
    };

    const handleDeletePost = async (id) => {
        if (window.confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
            await removePost(id);
            navigate('/comm'); // 삭제 후 목록으로 이동
            fetchPosts();
            fetchNotices(2);
        }
    };

    const handleSubmitForm = async (postData) => {
        if (editingPostData && editingPostData.postId) {
            await editPost(editingPostData.postId, postData);
            const updatedPost = await fetchPostById(editingPostData.postId); // 수정된 게시글 다시 가져오기
            setCurrentPostDetail(updatedPost); // currentPostDetail 업데이트
            navigate(`/comm/${editingPostData.postId}`); // 수정 후 상세 페이지로 이동
        }
        else {
            await addPost(postData); // 새 게시글 추가 후 반환된 게시글 정보 사용
            navigate('/comm'); // 작성 후 목록으로 이동
        }
        setEditingPostData(null); // 폼 제출 후 수정 데이터 초기화
        fetchPosts();
        fetchNotices(2);
    };

    const handleCancelForm = () => {
        if (postId) {
            navigate(`/comm/${postId}`); // 상세 페이지에서 취소 시 상세 페이지로 돌아감
        }
        else {
            navigate('/comm'); // 목록에서 취소 시 목록으로 돌아감
        }
        setEditingPostData(null); // 폼 취소 후 수정 데이터 초기화
    };

    const paginate = (pageNumber) => {
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.set('page', pageNumber);
        setSearchParams(newSearchParams);
        setCurrentPage(pageNumber);
    };

    const handlePostsPerPageChange = (e) => {
        const newSize = parseInt(e.target.value);
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.set('size', newSize);
        newSearchParams.set('page', 1); // 페이지당 게시물 수 변경 시 1페이지로 리셋
        setSearchParams(newSearchParams);
        setPostsPerPage(newSize);
        setCurrentPage(1);
    };

    return {
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
        handleDeletePost,
        handleSubmitForm,
        handleCancelForm,
        paginate,
        handlePostsPerPageChange,
        searchType,
        searchKeyword,
        setSearchParams,
        setCurrentPage,
        setPostsPerPage
    };
};

export default useCommPage;
