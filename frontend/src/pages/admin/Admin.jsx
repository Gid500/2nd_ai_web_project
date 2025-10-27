import React, { useState, useEffect, useCallback } from 'react';
import LoadingSpinner from '../../common/components/LoadingSpinner';
import { useAdminCheck } from './hook/useAdminCheck';
import { getAllUsers, adminDeleteUser } from '../../common/api/userApi';

function Admin() {
    const { isAdmin, loading } = useAdminCheck();
    const [users, setUsers] = useState([]);
    const [usersLoading, setUsersLoading] = useState(true);
    const [usersError, setUsersError] = useState(null);

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

    useEffect(() => {
        if (isAdmin) {
            fetchUsers();
        }
    }, [isAdmin, fetchUsers]);

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

    if (loading || usersLoading) {
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
        </div>
    );
}

export default Admin;