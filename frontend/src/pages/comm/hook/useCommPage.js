import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCommPosts } from './useCommPosts'; // useCommPosts 훅 임포트

const useCommPage = () => {
    const { postId } = useParams();
    const navigate = useNavigate();

    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage, setPostsPerPage] = useState(10);
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
        totalPosts
    } = useCommPosts(currentPage, postsPerPage);

    useEffect(() => {
        if (postId) {
            fetchPostById(parseInt(postId));
        } else {
            setSelectedPost(null);
            fetchPosts();
        }
    }, [postId, fetchPostById, setSelectedPost, fetchPosts, currentPage, postsPerPage]);

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
            fetchPosts();
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
        fetchPosts();
    };

    const handleCancelForm = () => {
        setShowForm(false);
        setEditingPost(null);
        navigate('/comm');
    };

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handlePostsPerPageChange = (e) => {
        setPostsPerPage(parseInt(e.target.value));
        setCurrentPage(1);
    };

    return {
        posts,
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
    };
};

export default useCommPage;
