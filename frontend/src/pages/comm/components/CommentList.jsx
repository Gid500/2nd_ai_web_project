import React, { useState } from 'react'; // useState 추가
import './CommentList.css'; // CSS 파일 임포트
import { createReport } from '../api/commApi'; // createReport 임포트

const REPORT_TYPES = [
    { id: 1, name: '욕설' },
    { id: 2, name: '광고' },
    { id: 3, name: '음란물' },
];

function CommentList({ comments, onEditComment, onDeleteComment, currentUserId, isAdmin }) {
    const [showReportModal, setShowReportModal] = useState(false); // 신고 모달 표시 여부
    const [selectedReportTypeId, setSelectedReportTypeId] = useState(REPORT_TYPES[0].id); // 선택된 신고 유형 ID
    const [reportReason, setReportReason] = useState(''); // 신고 사유
    const [reportingComment, setReportingComment] = useState(null); // 현재 신고 대상 댓글

    if (!comments || comments.length === 0) {
        return <p className="comment-list-empty">아직 댓글이 없습니다.</p>;
    }

    const handleReportComment = (comment) => {
        if (!currentUserId) {
            alert('로그인 후 신고할 수 있습니다.');
            return;
        }
        setReportingComment(comment);
        setShowReportModal(true);
    };

    const handleReportSubmit = async () => {
        if (!reportReason.trim()) {
            alert('신고 사유를 입력해야 합니다.');
            return;
        }

        if (!reportingComment) return; // 신고 대상 댓글이 없으면 리턴

        const reportData = {
            reportedPostId: reportingComment.postId,
            reportedCommentId: reportingComment.commentId,
            reporterUserId: currentUserId,
            reportedUserId: reportingComment.userId, // 댓글 작성자 ID
            reportContent: reportReason,
            reportTypeId: selectedReportTypeId,
            reportContentType: "comment"
        };

        try {
            await createReport(reportData);
            alert('댓글이 성공적으로 신고되었습니다.');
            setShowReportModal(false);
            setReportReason('');
            setSelectedReportTypeId(REPORT_TYPES[0].id);
            setReportingComment(null);
        } catch (error) {
            console.error('Error reporting comment:', error);
            alert('댓글 신고 중 오류가 발생했습니다.');
        }
    };

    const handleCloseReportModal = () => {
        setShowReportModal(false);
        setReportReason('');
        setSelectedReportTypeId(REPORT_TYPES[0].id);
        setReportingComment(null);
    };

    return (
        <div className="comment-list-container">
            {comments.map(comment => (
                <div key={comment.commentId} className="comment-item">
                    <div className="comment-header">
                        <span className="comment-author">{comment.userNickname}</span>
                        <span className="comment-date">{new Date(comment.createdDate).toLocaleString()}</span>
                    </div>
                    <p className="comment-content">{comment.comment}</p>
                    <div className="comment-actions">
                        {(currentUserId === comment.userId || isAdmin) && (
                            <>
                                {currentUserId === comment.userId && (
                                    <button onClick={() => onEditComment(comment.commentId)} className="comment-edit-button">수정</button>
                                )}
                                <button onClick={() => onDeleteComment(comment.commentId)} className="comment-delete-button">삭제</button>
                            </>
                        )}
                        {currentUserId && currentUserId !== comment.userId && !isAdmin && (
                            <button onClick={() => handleReportComment(comment)} className="comment-report-button">신고</button>
                        )}
                    </div>
                </div>
            ))}

            {/* 신고 모달 */}
            {showReportModal && (
                <div className="report-modal-overlay">
                    <div className="report-modal-content">
                        <h3>댓글 신고</h3>
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
}

export default CommentList;
