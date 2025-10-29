import { useState, useEffect, useCallback } from 'react';
import { getAllPosts, getPostById, createPost, updatePost, deletePost, getTopNotices, searchPosts } from '../api/commApi'; // commApi에서 함수 임포트

export const useCommPosts = (page = 1, size = 10, searchType = '', searchKeyword = '') => {
    const [posts, setPosts] = useState([]);
    const [notices, setNotices] = useState([]); // 공지사항 상태 추가
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [totalPosts, setTotalPosts] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const fetchPosts = useCallback(async () => {
        setLoading(true);
        try {
            let response;
            if (searchType && searchKeyword) {
                response = await searchPosts(searchType, searchKeyword, page, size);
            } else {
                response = await getAllPosts(page, size); // commApi의 getAllPosts 사용
            }
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
    }, [page, size, searchType, searchKeyword]);

    const fetchNotices = useCallback(async (count) => {
        try {
            const response = await getTopNotices(count);
            setNotices(response);
        } catch (err) {
            console.error("Error fetching notices:", err);
            setNotices([]);
        }
    }, []);

    const fetchPostById = useCallback(async (id) => {
        setLoading(true);
        try {
            const response = await getPostById(id); // commApi의 getPostById 사용
            setError(null);
            return response; // 게시글 데이터 반환
        } catch (err) {
            setError(err);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const addPost = useCallback(async (formData) => {
        setLoading(true);
        try {
            await createPost(formData); // commApi의 createPost 사용
            await fetchPosts();
            await fetchNotices(2); // 공지사항도 새로고침
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    }, [fetchPosts, fetchNotices]);

    const editPost = useCallback(async (id, formData) => {
        setLoading(true);
        try {
            await updatePost(id, formData); // commApi의 updatePost 사용
            await fetchPosts();
            await fetchNotices(2); // 공지사항도 새로고침
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    }, [fetchPosts, fetchNotices]);

    const removePost = useCallback(async (id) => {
        setLoading(true);
        try {
            await deletePost(id); // commApi의 deletePost 사용
            await fetchPosts();
            await fetchNotices(2); // 공지사항도 새로고침
        } catch (err) {
            setError(err);
        }
        finally {
            setLoading(false);
        }
    }, [fetchPosts, fetchNotices]);

    useEffect(() => {
        fetchPosts();
        fetchNotices(2); // 컴포넌트 마운트 시 상위 2개 공지사항 가져오기
    }, [fetchPosts, fetchNotices]);

    return {
        posts,
        notices, // 공지사항 반환
        loading,
        error,
        fetchPosts,
        fetchNotices,
        fetchPostById,
        addPost,
        editPost,
        removePost,
        totalPosts,
        totalPages
    };
};
