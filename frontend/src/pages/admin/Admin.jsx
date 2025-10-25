import React, { useEffect, useState } from 'react';
import useAxios from '../../common/hook/useAxios';
import LoadingSpinner from '../../common/components/LoadingSpinner';

function Admin() {
    const { response, error, loading, fetchData } = useAxios();
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        fetchData({ url: '/api/checkSession', method: 'get' });
    }, []);

    useEffect(() => {
        if (response && response.roleType) {
            setIsAdmin(response.roleType.toLowerCase() === 'admin');
        }
    }, [response]);

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <LoadingSpinner />
            </div>
        ); // Loading message
    }

    if (error) {
        return <div>오류 발생: {error.message}</div>; // Error message
    }

    return (
        <div>
            {isAdmin ? (
                <h1>관리자 페이지</h1> // Admin content
            ) : (
                <h1>접근 권한이 없습니다.</h1> // Access denied message
            )}
        </div>
    );
}

export default Admin;