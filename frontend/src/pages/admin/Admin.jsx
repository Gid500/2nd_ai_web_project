import React, { useState, useEffect, useCallback } from 'react';
import LoadingSpinner from '../../common/components/LoadingSpinner';
import { useAdminCheck } from './hook/useAdminCheck';
import { getAllUsers, adminDeleteUser } from '../../common/api/userApi';
import { getAllPosts, deletePost } from '../../pages/comm/api/commApi';
import { getAllComments, adminDeleteComment } from '../../pages/comm/api/commentApi'; // Import comment API
import { getAllReports, deleteReport } from '../../common/api/reportApi'; // Import report API
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

    const [comments, setComments] = useState([]); // New state for comments
    const [commentsLoading, setCommentsLoading] = useState(true); // New state for comments loading
    const [commentsError, setCommentsError] = useState(null); // New state for comments error
    const [currentCommentPage, setCurrentCommentPage] = useState(1); // New state for comments current page
    const [commentsPerPage, setCommentsPerPage] = useState(10); // New state for comments per page
    const [totalComments, setTotalComments] = useState(0); // New state for total comments

    const [reports, setReports] = useState([]); // New state for reports
    const [reportsLoading, setReportsLoading] = useState(true); // New state for reports loading
    const [reportsError, setReportsError] = useState(null); // New state for reports error
    const [currentReportPage, setCurrentReportPage] = useState(1); // New state for reports current page
    const [reportsPerPage, setReportsPerPage] = useState(10); // New state for reports per page
    const [totalReports, setTotalReports] = useState(0); // New state for total reports

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

    const fetchComments = useCallback(async () => { // New function to fetch comments
        setCommentsLoading(true);
        try {
            const data = await getAllComments(currentCommentPage, commentsPerPage);
            setComments(data.comments || []); // Ensure comments is always an array
            setTotalComments(data.totalComments || 0);
            setCommentsError(null);
        } catch (err) {
            setCommentsError(err);
            setComments([]);
            setTotalComments(0);
        } finally {
            setCommentsLoading(false);
        }
    }, [currentCommentPage, commentsPerPage]);

    const fetchReports = useCallback(async () => { // New function to fetch reports
        setReportsLoading(true);
        try {
            const data = await getAllReports(currentReportPage, reportsPerPage);
            setReports(data.reports || []); // Ensure reports is always an array
            setTotalReports(data.totalReports || 0);
            setReportsError(null);
        } catch (err) {
            setReportsError(err);
            setReports([]);
            setTotalReports(0);
        } finally {
            setReportsLoading(false);
        }
    }, [currentReportPage, reportsPerPage]);

    useEffect(() => {
        if (isAdmin) {
            fetchUsers();
            fetchPosts();
            fetchComments(); // Fetch comments when admin is true
            fetchReports(); // Fetch reports when admin is true
        }
    }, [isAdmin, fetchUsers, fetchPosts, fetchComments, fetchReports]);

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

    const handleDeleteComment = async (commentId) => { // New function to delete comment
        if (window.confirm(`정말로 댓글 ID: ${commentId} 를 삭제하시겠습니까?`)) {
            try {
                await adminDeleteComment(commentId);
                alert(`댓글 ${commentId} 가 성공적으로 삭제되었습니다.`);
                fetchComments(); // 댓글 목록 새로고침
            } catch (error) {
                alert(`댓글 ${commentId} 삭제 처리 중 오류가 발생했습니다: ${error.message}`);
                console.error(`Error deleting comment ${commentId}:`, error);
            }
        }
    };

    const handleDeleteReport = async (reportId) => { // New function to delete report
        if (window.confirm(`정말로 신고 ID: ${reportId} 를 삭제하시겠습니까?`)) {
            try {
                await deleteReport(reportId);
                alert(`신고 ${reportId} 가 성공적으로 삭제되었습니다.`);
                fetchReports(); // 신고 목록 새로고침
            } catch (error) {
                alert(`신고 ${reportId} 삭제 처리 중 오류가 발생했습니다: ${error.message}`);
                console.error(`Error deleting report ${reportId}:`, error);
            }
        }
    };

    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const paginateComments = (pageNumber) => setCurrentCommentPage(pageNumber);
    const paginateReports = (pageNumber) => setCurrentReportPage(pageNumber);

    const handlePostsPerPageChange = (e) => {
        setPostsPerPage(parseInt(e.target.value));
        setCurrentPage(1); // 페이지당 게시물 수 변경 시 1페이지로 리셋
    };

    const handleCommentsPerPageChange = (e) => {
        setCommentsPerPage(parseInt(e.target.value));
        setCurrentCommentPage(1); // 페이지당 댓글 수 변경 시 1페이지로 리셋
    };

    const handleReportsPerPageChange = (e) => {
        setReportsPerPage(parseInt(e.target.value));
        setCurrentReportPage(1); // 페이지당 신고 수 변경 시 1페이지로 리셋
    };

    if (loading || usersLoading || postsLoading || commentsLoading || reportsLoading) { // Include reportsLoading
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

    if (commentsError) { // New error handling for comments
        return <p>댓글 목록을 불러오는 중 오류가 발생했습니다: {commentsError.message}</p>;
    }

    if (reportsError) { // New error handling for reports
        return <p>신고 목록을 불러오는 중 오류가 발생했습니다: {reportsError.message}</p>;
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

            <h2 style={{ marginTop: '40px' }}>댓글 관리</h2> {/* New section for comments */}
            <div className="comm-posts-per-page-selector">
                <label>페이지당 댓글 수:</label>
                <select value={commentsPerPage} onChange={handleCommentsPerPageChange}>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={40}>40</option>
                </select>
            </div>
            {comments.length > 0 ? (
                <table>
                    <thead>
                        <tr>
                            <th>Comment ID</th>
                            <th>Post ID</th>
                            <th>User ID</th>
                            <th>Author</th>
                            <th>Content</th>
                            <th>Created At</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {comments.map(comment => (
                            <tr key={comment.commentId}>
                                <td>{comment.commentId}</td>
                                <td>{comment.postId}</td>
                                <td>{comment.userId}</td>
                                <td>{comment.userNickname}</td>
                                <td>{comment.comment}</td>
                                <td>{new Date(comment.createdDate).toLocaleString()}</td>
                                <td>
                                    <button onClick={() => handleDeleteComment(comment.commentId)}>삭제</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>등록된 댓글이 없습니다.</p>
            )}
            <AdminPagination
                postsPerPage={commentsPerPage}
                totalPosts={totalComments}
                onPageChange={paginateComments}
                currentPage={currentCommentPage}
            />

            <h2 style={{ marginTop: '40px' }}>신고 관리</h2>
            <div className="comm-posts-per-page-selector">
                <label>페이지당 신고 수:</label>
                <select value={reportsPerPage} onChange={handleReportsPerPageChange}>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={40}>40</option>
                </select>
            </div>
            {reports.length > 0 ? (
                <table>
                    <thead>
                        <tr>
                            <th>신고 ID</th>
                            <th>신고된 게시물 ID</th>
                            <th>신고된 댓글 ID</th>
                            <th>신고자 ID</th>
                            <th>신고된 사용자 ID</th>
                            <th>신고 내용</th>
                            <th>신고 타입</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reports.map(report => (
                            <tr key={report.reportId}>
                                <td>{report.reportId}</td>
                                <td>{report.reportedPostId || 'N/A'}</td>
                                <td>{report.reportedCommentId || 'N/A'}</td>
                                <td>{report.reporterUserId}</td>
                                <td>{report.reportedUserId}</td>
                                <td>{report.reportContent}</td>
                                <td>{report.typeName}</td>
                                <td>
                                    <button onClick={() => handleDeleteReport(report.reportId)}>삭제</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>등록된 신고가 없습니다.</p>
            )}
            <AdminPagination
                postsPerPage={reportsPerPage}
                totalPosts={totalReports}
                onPageChange={paginateReports}
                currentPage={currentReportPage}
            />
        </div>
    );
}

export default Admin;