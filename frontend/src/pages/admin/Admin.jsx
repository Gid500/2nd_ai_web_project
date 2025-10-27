import React from 'react';
import LoadingSpinner from '../../common/components/LoadingSpinner';
import { useAdminCheck } from './hook/useAdminCheck';

function Admin() {
    const { isAdmin, loading } = useAdminCheck();

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <LoadingSpinner />
            </div>
        );
    }

    return (
        <div>
            {isAdmin ? (
                <h1>관리자 페이지</h1>
            ) : (
                <h1>접근 권한이 없습니다.</h1>
            )}
        </div>
    );
}

export default Admin;