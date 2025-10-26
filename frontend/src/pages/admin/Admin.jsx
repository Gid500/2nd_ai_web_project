import React from 'react';
import LoadingSpinner from '../../common/components/LoadingSpinner';
import { useAdminCheck } from './hook/useAdminCheck'; // 새로 생성한 훅 임포트

function Admin() {
    const { isAdmin, error, loading } = useAdminCheck();

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <LoadingSpinner />
            </div>
        );
    }

    if (error) {
        return <div>오류 발생: {error.message}</div>;
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