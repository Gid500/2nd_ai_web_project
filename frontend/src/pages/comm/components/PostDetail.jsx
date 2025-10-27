import React, { useState } from 'react'; // useState 추가
import { useAuth } from '../../../common/hook/useAuth';
import './PostDetail.css';
import { Link, useNavigate } from 'react-router-dom'; // Link, useNavigate 임포트
// CommentList와 CommentForm 컴포넌트 import
import CommentList from './CommentList'; // 경로 수정
import CommentForm from './CommentForm'; // 경로 수정
import { addComment, updateComment, deleteComment } from '../api/commCommentApi'; // commCommentApi 임포트
import { createReport } from '../api/commApi'; // createReport 임포트

// 백엔드 기본 URL (환경 변수 또는 설정 파일에서 가져오는 것이 좋지만, 일단 하드코딩)
const BACKEND_BASE_URL = 'http://localhost:8080';

const REPORT_TYPES = [
    { id: 1, name: '욕설' },
    { id: 2, name: '광고' },
    { id: 3, name: '음란물' },
];

const PostDetail = ({ post, onBackToList, onDelete, comments, fetchComments }) => {
    const { user, isAdmin } = useAuth();
    const navigate = useNavigate(); // useNavigate 훅 사용
    const [editingComment, setEditingComment] = useState(null); // 댓글 수정 상태 관리
    const [showReportModal, setShowReportModal] = useState(false); // 신고 모달 표시 여부
    const [selectedReportTypeId, setSelectedReportTypeId] = useState(REPORT_TYPES[0].id); // 선택된 신고 유형 ID
    const [reportReason, setReportReason] = useState(''); // 신고 사유

    if (!post) {
        return <p>게시글을 찾을 수 없습니다.</p>;
    }

    const decodedContent = post.postContent || '';

    const handleDeleteClick = () => {
        onDelete(post.postId); // useCommPage의 handleDeletePost 호출
    };

    // 댓글 추가/수정 핸들러
    const handleAddOrUpdateComment = async (commentData) => {
        try {
            if (commentData.commentId) { // commentId가 있으면 수정
                await updateComment(commentData.commentId, { comment: commentData.comment, userId: user.userId });
            } else { // 없으면 추가
                await addComment({ postId: post.postId, comment: commentData.comment, userId: user.userId });
            }
            fetchComments(post.postId); // 댓글 목록 새로고침
            setEditingComment(null); // 수정 모드 종료
        } catch (error) {
            console.error('Error adding/updating comment:', error);
            alert('댓글 작성/수정 중 오류가 발생했습니다.');
        }
    };

    // 댓글 수정 시작 핸들러
    const handleEditComment = (commentId) => {
        const commentToEdit = comments.find(c => c.commentId === commentId);
        setEditingComment(commentToEdit);
    };

    // 댓글 삭제 핸들러
    const handleDeleteComment = async (commentId) => {
        if (window.confirm('정말로 이 댓글을 삭제하시겠십니까?')) {
            try {
                await deleteComment(commentId);
                fetchComments(post.postId); // 댓글 목록 새로고침
            } catch (error) {
                console.error('Error deleting comment:', error);
                alert('댓글 삭제 중 오류가 발생했습니다.');
            }
        }
    };

    const handleReportPost = () => {
        if (!user) {
            alert('로그인 후 신고할 수 있습니다.');
            return;
        }
        setShowReportModal(true);
    };

    const handleReportSubmit = async () => {
        if (!reportReason.trim()) {
            alert('신고 사유를 입력해야 합니다.');
            return;
        }

        const reportData = {
            reportedPostId: post.postId,
            reporterUserId: user.userId,
            reportedUserId: post.userId, // 게시글 작성자 ID
            reportContent: reportReason,
            reportTypeId: selectedReportTypeId,
            reportContentType: "post"
        };

        try {
            await createReport(reportData);
            alert('게시글이 성공적으로 신고되었습니다.');
            setShowReportModal(false);
            setReportReason('');
            setSelectedReportTypeId(REPORT_TYPES[0].id);
        } catch (error) {
            console.error('Error reporting post:', error);
            alert('게시글 신고 중 오류가 발생했습니다.');
        }
    };

    const handleCloseReportModal = () => {
        setShowReportModal(false);
        setReportReason('');
        setSelectedReportTypeId(REPORT_TYPES[0].id);
    };

    return (
        <div className="post-detail-container">
            <h2 className="post-detail-title">
                {post.isNotice && <span className="post-detail-notice-tag">[공지]</span>}
                {post.postTitle}
            </h2>
            <p className="post-detail-meta-info">작성자: {post.userNickname || post.userId}</p> {/* userNickname 사용 */}
            <p className="post-detail-meta-info">작성일: {new Date(post.createdDate).toLocaleString()}</p>
            {post.updatedDate && new Date(post.updatedDate).getTime() !== new Date(post.createdDate).getTime() && (
                <p className="post-detail-meta-info">수정일: {new Date(post.updatedDate).toLocaleString()}</p>
            )}
            <div className="post-detail-content-section">
                <h3>내용:</h3>
                <p>{decodedContent}</p>
            </div>
            {post.files && post.files.length > 0 && (
                <div className="post-detail-files-section">
                    <h3>첨부 파일:</h3>
                    <ul className="post-detail-file-list">
                        {post.files.map(file => (
                            <li key={file.fileId} className="post-detail-file-item">
                                {/* 이미지가 맞다면 <img> 태그로 표시 */}
                                {file.fileType && file.fileType.startsWith('image/') ? (
                                    <img src={`${BACKEND_BASE_URL}${file.imgUrl}`} alt={file.uploadName} className="post-detail-file-image" />
                                ) : (
                                    // 이미지가 아니면 기존처럼 링크로 표시
                                    <a href={`${BACKEND_BASE_URL}${file.imgUrl}`} target="_blank" rel="noopener noreferrer">{file.uploadName}</a>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            <div className="post-detail-actions">
                <button onClick={onBackToList}>목록으로 돌아가기</button>
                {(isAdmin || (user && user.userId === post.userId)) && (
                    <> 
                        <Link to={`/comm/${post.postId}/edit`} className="button">수정</Link>
                        <button onClick={handleDeleteClick}>삭제</button>
                    </>
                )}
                {user && user.userId !== post.userId && !isAdmin && (
                    <button onClick={handleReportPost} className="report-button">신고</button>
                )}
            </div>

            {/* 댓글 섹션 추가 */}
            <div className="comment-section">
                {user && ( // 로그인한 사용자만 댓글 작성/수정 폼 표시
                    <CommentForm
                        postId={post.postId}
                        onAddComment={handleAddOrUpdateComment}
                        initialComment={editingComment}
                        onCancelEdit={() => setEditingComment(null)}
                    />
                )}
                <CommentList
                    comments={comments}
                    onEditComment={handleEditComment}
                    onDeleteComment={handleDeleteComment}
                    currentUserId={user?.userId} // 현재 로그인한 사용자 ID 전달
                    isAdmin={isAdmin}
                />
            </div>

            {/* 신고 모달 */}
            {showReportModal && (
                <div className="report-modal-overlay">
                    <div className="report-modal-content">
                        <h3>게시글 신고</h3>
                        <div className="form-group">
                            <label htmlFor="reportType">신고 유형:</label>
                            <select
                                id="reportType"
                                value={selectedReportTypeId}
                                onChange={(e) => setSelectedReportTypeId(parseInt(e.target.value))}
                                className="report-select"
                            >
                                {REPORT_TYPES.map(type => (
                                    <option key={type.id} value={type.id}>{type.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="reportReason">신고 사유:</label>
                            <textarea
                                id="reportReason"
                                value={reportReason}
                                onChange={(e) => setReportReason(e.target.value)}
                                placeholder="신고 사유를 자세히 입력해주세요."
                                rows="5"
                                className="report-textarea"
                            ></textarea>
                        </div>
                        <div className="modal-actions">
                            <button onClick={handleReportSubmit} className="report-submit-button">신고 제출</button>
                            <button onClick={handleCloseReportModal} className="report-cancel-button">취소</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PostDetail;