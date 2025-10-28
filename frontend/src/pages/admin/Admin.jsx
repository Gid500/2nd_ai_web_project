import React from 'react';
import { Link, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import LoadingSpinner from '../../common/components/LoadingSpinner';
import { useAdminCheck } from './hook/useAdminCheck';
import AdminUser from './components/AdminUser';
import AdminPost from './components/AdminPost';
import AdminComment from './components/AdminComment';
import AdminReport from './components/AdminReport';

function Admin() {
    const { isAdmin, loading } = useAdminCheck();
    const location = useLocation();
    const navigate = useNavigate();

    // 관리자 페이지 로드 시 기본 탭으로 리다이렉트
    React.useEffect(() => {
        if (isAdmin && location.pathname === '/admin') {
            navigate('/admin/users');
        }
    }, [isAdmin, location.pathname, navigate]);

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <LoadingSpinner />
            </div>
        );
    }

    if (!isAdmin) {
        return <h1>접근 권한이 없습니다.</h1>;
    }

    return (
        <div>
            <h1>관리자 페이지</h1>
            <nav>
                <Link to="/admin/users" style={{ fontWeight: location.pathname.startsWith('/admin/users') ? 'bold' : 'normal', marginRight: '10px' }}>사용자 관리</Link>
                <Link to="/admin/posts" style={{ fontWeight: location.pathname.startsWith('/admin/posts') ? 'bold' : 'normal', marginRight: '10px' }}>게시물 관리</Link>
                <Link to="/admin/comments" style={{ fontWeight: location.pathname.startsWith('/admin/comments') ? 'bold' : 'normal', marginRight: '10px' }}>댓글 관리</Link>
                <Link to="/admin/reports" style={{ fontWeight: location.pathname.startsWith('/admin/reports') ? 'bold' : 'normal', marginRight: '10px' }}>신고 관리</Link>
            </nav>

            <div style={{ marginTop: '20px' }}>
                <Routes>
                    <Route path="users" element={<AdminUser />} />
                    <Route path="posts" element={<AdminPost />} />
                    <Route path="comments" element={<AdminComment />} />
                    <Route path="reports" element={<AdminReport />} />
                    <Route path="*" element={<AdminUser />} /> {/* 기본 경로 설정 */}
                </Routes>
            </div>
        </div>
    );
}

export default Admin;