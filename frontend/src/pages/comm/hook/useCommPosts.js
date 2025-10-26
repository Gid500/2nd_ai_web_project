import { useState, useEffect, useCallback } from 'react';
import { getAllPosts, getPostById, createPost, updatePost, deletePost } from '../api/commApi'; // commApi에서 함수 임포트

export const useCommPosts = (page = 1, size = 10) => {
    const [posts, setPosts] = useState([]);
    const [selectedPost, setSelectedPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [totalPosts, setTotalPosts] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const fetchPosts = useCallback(async () => {
        setLoading(true);
        try {
            const response = await getAllPosts(page, size); // commApi의 getAllPosts 사용
            setPosts(response.posts);
            setTotalPosts(response.totalPosts);
            setTotalPages(response.totalPages);
            setError(null);
        } catch (err) {
            setError(err);
            setPosts([]);
            setTotalPosts(0);
            setTotalPages(0);
        } finally {
            setLoading(false);
        }
    }, [page, size]);

    const fetchPostById = useCallback(async (id) => {
        setLoading(true);
        try {
            const response = await getPostById(id); // commApi의 getPostById 사용
            setSelectedPost(response);
            setError(null);
        } catch (err) {
            setError(err);
            setSelectedPost(null);
        } finally {
            setLoading(false);
        }
    }, []);

    const addPost = useCallback(async (formData) => {
        setLoading(true);
        try {
            await createPost(formData); // commApi의 createPost 사용
            await fetchPosts();
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    }, [fetchPosts]);

    const editPost = useCallback(async (id, formData) => {
        setLoading(true);
        try {
            await updatePost(id, formData); // commApi의 updatePost 사용
            await fetchPosts();
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    }, [fetchPosts]);

    const removePost = useCallback(async (id) => {
        setLoading(true);
        try {
            await deletePost(id); // commApi의 deletePost 사용
            await fetchPosts();
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    }, [fetchPosts]);

    useEffect(() => {
        if (!selectedPost) {
            fetchPosts();
        }
    }, [fetchPosts, selectedPost]);

    return {
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
        totalPosts,
        totalPages
    };
};
