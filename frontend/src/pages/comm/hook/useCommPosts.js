import { useState, useEffect, useCallback } from 'react';
import api from '../../../common/api/api';

export const useCommPosts = (page = 1, size = 10) => { // page와 size 파라미터 추가
    const [posts, setPosts] = useState([]);
    const [selectedPost, setSelectedPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [totalPosts, setTotalPosts] = useState(0); // 총 게시물 수 상태 추가
    const [totalPages, setTotalPages] = useState(0); // 총 페이지 수 상태 추가

    const fetchPosts = useCallback(async () => {
        setLoading(true);
        try {
            // API 호출 시 page와 size 파라미터 전달
            const response = await api.get(`/api/posts?page=${page}&size=${size}`);
            setPosts(response.data.posts);
            setTotalPosts(response.data.totalPosts); // 총 게시물 수 설정
            setTotalPages(response.data.totalPages); // 총 페이지 수 설정
            setError(null);
        } catch (err) {
            setError(err);
            setPosts([]);
            setTotalPosts(0);
            setTotalPages(0);
        }
        finally {
            setLoading(false);
        }
    }, [page, size]); // page와 size가 변경될 때마다 fetchPosts 재생성

    const fetchPostById = useCallback(async (id) => {
        setLoading(true);
        try {
            const response = await api.get(`/api/posts/${id}`);
            setSelectedPost(response.data);
            setError(null);
        } catch (err) {
            setError(err);
            setSelectedPost(null);
        }
        finally {
            setLoading(false);
        }
    }, []);

    const addPost = useCallback(async (formData) => { // postData 대신 formData
        setLoading(true);
        try {
            await api.post('/api/posts/create', formData); // formData 직접 전달
            await fetchPosts(); // 게시물 추가 후 목록 새로고침
        } catch (err) {
            setError(err);
        }
        finally {
            setLoading(false);
        }
    }, [fetchPosts]);

    const editPost = useCallback(async (id, formData) => { // postData 대신 formData
        setLoading(true);
        try {
            await api.put(`/api/posts/update/${id}`, formData); // formData 직접 전달
            await fetchPosts(); // 게시물 수정 후 목록 새로고침
        } catch (err) {
            setError(err);
        }
        finally {
            setLoading(false);
        }
    }, [fetchPosts]);

    const removePost = useCallback(async (id) => {
        setLoading(true);
        try {
            await api.delete(`/api/posts/delete/${id}`);
            await fetchPosts(); // 게시물 삭제 후 목록 새로고침
        } catch (err) {
            setError(err);
        }
        finally {
            setLoading(false);
        }
    }, [fetchPosts]);

    useEffect(() => {
        if (!selectedPost) { // 상세 게시물이 선택되지 않았을 때만 목록을 불러옴
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
        totalPosts, // totalPosts 반환
        totalPages // totalPages 반환
    };
};
