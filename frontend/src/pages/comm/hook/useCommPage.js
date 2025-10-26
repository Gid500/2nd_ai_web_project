import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCommPosts } from './useCommPosts'; // useCommPosts 훅 임포트
import { getCommentsByPostId } from '../../commnet/api/commentApi'; // 댓글 API 임포트

const useCommPage = () => {
    const { postId } = useParams(); // URL에서 postId를 직접 가져옴
    const navigate = useNavigate();

    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage, setPostsPerPage] = useState(10);
    const [currentPostDetail, setCurrentPostDetail] = useState(null); // 상세 게시글 데이터를 저장할 상태
    const [editingPostData, setEditingPostData] = useState(null); // 수정할 게시글 데이터를 저장할 상태
    const [comments, setComments] = useState([]); // 댓글 목록 상태 추가

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
    } = useCommPosts(currentPage, postsPerPage);

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
            const getPostAndCommentsDetail = async () => {
                const post = await fetchPostById(parseInt(postId));
                setCurrentPostDetail(post);
                fetchCommentsForPost(parseInt(postId)); // 댓글도 함께 가져옴
            };
            getPostAndCommentsDetail();
        } else {
            setCurrentPostDetail(null);
            setEditingPostData(null); // postId가 없으면 수정 데이터도 초기화
            setComments([]); // 댓글 목록 초기화
            fetchPosts();
            fetchNotices(2); // CommPage가 로드될 때 공지사항도 가져오도록 추가
        }
    }, [postId, fetchPostById, fetchCommentsForPost, fetchPosts, fetchNotices, currentPage, postsPerPage]);

    const handleViewDetail = (id) => {
        navigate(`/comm/${id}`);
    };

    const handleCreateNewPost = () => {
        setEditingPostData(null); // 새 게시글 작성 시 기존 수정 데이터 초기화
        navigate('/comm/new');
    };

    const handleEditPost = (post) => {
        setEditingPostData(post); // 수정할 게시글 데이터 설정
        navigate(`/comm/${post.postId}/edit`);
    };

    const handleDeletePost = async (id) => {
        if (window.confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
            await removePost(id);
            navigate('/comm'); // 삭제 후 목록으로 이동
            fetchPosts();
            fetchNotices(2); // 공지사항도 새로고침
        }
    };

    const handleSubmitForm = async (postData) => {
        if (editingPostData && editingPostData.postId) {
            await editPost(editingPostData.postId, postData);
            navigate(`/comm/${editingPostData.postId}`); // 수정 후 상세 페이지로 이동
        }
        else {
            const newPost = await addPost(postData); // 새 게시글 추가 후 반환된 게시글 정보 사용
            navigate('/comm'); // 작성 후 목록으로 이동
        }
        setEditingPostData(null); // 폼 제출 후 수정 데이터 초기화
        fetchPosts();
        fetchNotices(2); // 공지사항도 새로고침
    };

    const handleCancelForm = () => {
        if (postId) {
            navigate(`/comm/${postId}`); // 상세 페이지에서 취소 시 상세 페이지로 돌아감
        } else {
            navigate('/comm'); // 목록에서 취소 시 목록으로 돌아감
        }
        setEditingPostData(null); // 폼 취소 후 수정 데이터 초기화
    };

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handlePostsPerPageChange = (e) => {
        setPostsPerPage(parseInt(e.target.value));
        setCurrentPage(1);
    };

    return {
        posts,
        notices,
        currentPostDetail, // 상세 게시글 데이터 반환
        editingPostData, // 수정할 게시글 데이터 반환
        comments, // 댓글 목록 반환
        fetchCommentsForPost, // 댓글 갱신 함수 반환
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
    };
};

export default useCommPage;
