import React, { useState, useEffect, useCallback } from 'react';
import LoadingSpinner from '../../common/components/LoadingSpinner';
import { useAdminCheck } from './hook/useAdminCheck';
import { getAllUsers, adminDeleteUser } from '../../common/api/userApi';
import { getAllPosts, deletePost } from '../../pages/comm/api/commApi';
import AdminPagination from './components/AdminPagination'; // AdminPagination 컴포넌트 임포트

function Admin() {
    const { isAdmin, loading } = useAdminCheck();
    const [users, setUsers] = useState([]);
    const [usersLoading, setUsersLoading] = useState(true);
    const [usersError, setUsersError] = useState(null);

    const [posts, setPosts] = useState([]);
    const [postsLoading, setPostsLoading] = useState(true);
    const [postsError, setPostsError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage, setPostsPerPage] = useState(10);
    const [totalPosts, setTotalPosts] = useState(0);

    const fetchUsers = useCallback(async () => {
        setUsersLoading(true);
        try {
            const data = await getAllUsers();
            setUsers(data);
            setUsersError(null);
        } catch (err) {
            setUsersError(err);
            setUsers([]);
        } finally {
            setUsersLoading(false);
        }
    }, []);

    const fetchPosts = useCallback(async () => {
        setPostsLoading(true);
        try {
            const data = await getAllPosts(currentPage, postsPerPage);
            setPosts(data.posts);
            setTotalPosts(data.totalPosts);
            setPostsError(null);
        } catch (err) {
            setPostsError(err);
            setPosts([]);
            setTotalPosts(0);
        } finally {
            setPostsLoading(false);
        }
    }, [currentPage, postsPerPage]);

    useEffect(() => {
        if (isAdmin) {
            fetchUsers();
            fetchPosts();
        }
    }, [isAdmin, fetchUsers, fetchPosts]);

    const handleDeleteUser = async (userId) => {
        if (window.confirm(`정말로 사용자 ID: ${userId} 를 강제로 탈퇴시키겠습니까?`)) {
            try {
                await adminDeleteUser(userId);
                alert(`사용자 ${userId} 가 성공적으로 탈퇴 처리되었습니다.`);
                fetchUsers(); // 사용자 목록 새로고침
            } catch (error) {
                alert(`사용자 ${userId} 탈퇴 처리 중 오류가 발생했습니다: ${error.message}`);
                console.error(`Error deleting user ${userId}:`, error);
            }
        }
    };

    const handleDeletePost = async (postId) => {
        if (window.confirm(`정말로 게시물 ID: ${postId} 를 삭제하시겠습니까?`)) {
            try {
                await deletePost(postId);
                alert(`게시물 ${postId} 가 성공적으로 삭제되었습니다.`);
                fetchPosts(); // 게시물 목록 새로고침
            } catch (error) {
                alert(`게시물 ${postId} 삭제 처리 중 오류가 발생했습니다: ${error.message}`);
                console.error(`Error deleting post ${postId}:`, error);
            }
        }
    };

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handlePostsPerPageChange = (e) => {
        setPostsPerPage(parseInt(e.target.value));
        setCurrentPage(1); // 페이지당 게시물 수 변경 시 1페이지로 리셋
    };

    if (loading || usersLoading || postsLoading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <LoadingSpinner />
            </div>
        );
    }

    if (!isAdmin) {
        return <h1>접근 권한이 없습니다.</h1>;
    }

    if (usersError) {
        return <p>사용자 목록을 불러오는 중 오류가 발생했습니다: {usersError.message}</p>;
    }

    if (postsError) {
        return <p>게시물 목록을 불러오는 중 오류가 발생했습니다: {postsError.message}</p>;
    }

    return (
        <div>
            <h1>관리자 페이지</h1>
            <h2>사용자 관리</h2>
            {users.length > 0 ? (
                <table>
                    <thead>
                        <tr>
                            <th>User ID</th>
                            <th>Nickname</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.userId}>
                                <td>{user.userId}</td>
                                <td>{user.userNickname}</td>
                                <td>{user.userEmail}</td>
                                <td>{user.roleType}</td>
                                <td>
                                    <button onClick={() => handleDeleteUser(user.userId)}>강제 탈퇴</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>등록된 사용자가 없습니다.</p>
            )}

            <h2 style={{ marginTop: '40px' }}>게시물 관리</h2>
            <div className="comm-posts-per-page-selector">
                <label>페이지당 게시물 수:</label>
                <select value={postsPerPage} onChange={handlePostsPerPageChange}>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={40}>40</option>
                </select>
            </div>
            {posts.length > 0 ? (
                <table>
                    <thead>
                        <tr>
                            <th>Post ID</th>
                            <th>Title</th>
                            <th>Author ID</th>
                            <th>Author</th>
                            <th>Created At</th>
                            <th>Updated At</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {posts.map(post => (
                            <tr key={post.postId}>
                                <td>{post.postId}</td>
                                <td>{post.postTitle}</td>
                                <td>{post.userId}</td>
                                <td>{post.userNickname}</td>
                                <td>{new Date(post.createdDate).toLocaleString()}</td>
                                <td>{post.updatedDate ? new Date(post.updatedDate).toLocaleString() : 'N/A'}</td>
                                <td>
                                    <button onClick={() => handleDeletePost(post.postId)}>삭제</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>등록된 게시물이 없습니다.</p>
            )}
            <AdminPagination
                postsPerPage={postsPerPage}
                totalPosts={totalPosts}
                onPageChange={paginate}
                currentPage={currentPage}
            />
        </div>
    );
}

export default Admin;