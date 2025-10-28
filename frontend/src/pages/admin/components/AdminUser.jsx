import React, { useState, useEffect, useCallback } from 'react';
import { getAllUsers, adminDeleteUser } from '../../../common/api/userApi';
import AdminPagination from './AdminPagination';

function AdminUser() {
    const [users, setUsers] = useState([]);
    const [usersLoading, setUsersLoading] = useState(true);
    const [usersError, setUsersError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage, setUsersPerPage] = useState(10);
    const [totalUsers, setTotalUsers] = useState(0);

    const fetchUsers = useCallback(async () => {
        setUsersLoading(true);
        try {
            const data = await getAllUsers(currentPage, usersPerPage);
            setUsers(data.users);
            setTotalUsers(data.totalUsers);
            setUsersError(null);
        } catch (err) {
            setUsersError(err);
            setUsers([]);
            setTotalUsers(0);
        } finally {
            setUsersLoading(false);
        }
    }, [currentPage, usersPerPage]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

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

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handleUsersPerPageChange = (e) => {
        setUsersPerPage(parseInt(e.target.value));
        setCurrentPage(1); // 페이지당 사용자 수 변경 시 1페이지로 리셋
    };

    if (usersLoading) {
        return <p>사용자 정보를 불러오는 중...</p>;
    }

    if (usersError) {
        return <p>사용자 목록을 불러오는 중 오류가 발생했습니다: {usersError.message}</p>;
    }

    return (
        <section>
            <h2>사용자 관리</h2>
            <div className="comm-posts-per-page-selector">
                <label>페이지당 사용자 수:</label>
                <select value={usersPerPage} onChange={handleUsersPerPageChange}>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={40}>40</option>
                </select>
            </div>
            {users.length > 0 ? (
                <table>
                    <thead>
                        <tr>
                            <th>User ID</th>
                            <th>Nickname</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>신고 횟수</th>
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
                                <td>{user.reportCount}</td>
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
            <AdminPagination
                postsPerPage={usersPerPage}
                totalPosts={totalUsers}
                onPageChange={paginate}
                currentPage={currentPage}
            />
        </section>
    );
}

export default AdminUser;
