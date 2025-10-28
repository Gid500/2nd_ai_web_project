import React, { useState, useEffect, useCallback } from 'react';
import { getAllComments, adminDeleteComment } from '../../../pages/comm/api/commentApi';
import AdminPagination from './AdminPagination';

function AdminComment() {
    const [comments, setComments] = useState([]);
    const [commentsLoading, setCommentsLoading] = useState(true);
    const [commentsError, setCommentsError] = useState(null);
    const [currentCommentPage, setCurrentCommentPage] = useState(1);
    const [commentsPerPage, setCommentsPerPage] = useState(10);
    const [totalComments, setTotalComments] = useState(0);

    const fetchComments = useCallback(async () => {
        setCommentsLoading(true);
        try {
            const data = await getAllComments(currentCommentPage, commentsPerPage);
            setComments(data.comments || []);
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

    useEffect(() => {
        fetchComments();
    }, [fetchComments]);

    const handleDeleteComment = async (commentId) => {
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

    const paginateComments = (pageNumber) => setCurrentCommentPage(pageNumber);

    const handleCommentsPerPageChange = (e) => {
        setCommentsPerPage(parseInt(e.target.value));
        setCurrentCommentPage(1); // 페이지당 댓글 수 변경 시 1페이지로 리셋
    };

    if (commentsLoading) {
        return <p>댓글 정보를 불러오는 중...</p>;
    }

    if (commentsError) {
        return <p>댓글 목록을 불러오는 중 오류가 발생했습니다: {commentsError.message}</p>;
    }

    return (
        <section style={{ marginTop: '40px' }}>
            <h2>댓글 관리</h2>
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
        </section>
    );
}

export default AdminComment;
