import React from 'react';
import './CommentList.css'; // CSS 파일 임포트

function CommentList({ comments, onEditComment, onDeleteComment, currentUserId }) {
    if (!comments || comments.length === 0) {
        return <p className="comment-list-empty">아직 댓글이 없습니다.</p>;
    }

    return (
        <div className="comment-list-container">
            {comments.map(comment => (
                <div key={comment.commentId} className="comment-item">
                    <div className="comment-header">
                        <span className="comment-author">{comment.userNickname}</span>
                        <span className="comment-date">{new Date(comment.createdDate).toLocaleString()}</span>
                    </div>
                    <p className="comment-content">{comment.comment}</p>
                    {currentUserId === comment.userId && ( // 본인 댓글만 수정/삭제 가능
                        <div className="comment-actions">
                            <button onClick={() => onEditComment(comment.commentId)} className="comment-edit-button">수정</button>
                            <button onClick={() => onDeleteComment(comment.commentId)} className="comment-delete-button">삭제</button>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}

export default CommentList;
