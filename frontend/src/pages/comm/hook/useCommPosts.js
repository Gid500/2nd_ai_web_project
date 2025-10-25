import { useState, useEffect, useCallback } from 'react';
import { getAllPosts, getPostById, createPost, updatePost, deletePost } from '../api/commApi';

export const useCommPosts = () => {
    const [posts, setPosts] = useState([]);
    const [selectedPost, setSelectedPost] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchPosts = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getAllPosts();
            setPosts(data);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchPostById = useCallback(async (postId) => {
        setLoading(true);
        setError(null);
        try {
            const data = await getPostById(postId);
            setSelectedPost(data);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const addPost = useCallback(async (postData) => {
        setLoading(true);
        setError(null);
        try {
            await createPost(postData);
            await fetchPosts(); // Refresh the list after adding
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    }, [fetchPosts]);

    const editPost = useCallback(async (postId, postData) => {
        setLoading(true);
        setError(null);
        try {
            await updatePost(postId, postData);
            await fetchPosts(); // Refresh the list after updating
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    }, [fetchPosts]);

    const removePost = useCallback(async (postId) => {
        setLoading(true);
        setError(null);
        try {
            await deletePost(postId);
            await fetchPosts(); // Refresh the list after deleting
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    }, [fetchPosts]);

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

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
        setSelectedPost // To clear selected post or set it manually
    };
};
