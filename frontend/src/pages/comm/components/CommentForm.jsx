import React, { useState, useEffect } from 'react';
import './CommentForm.css'; // CSS 파일 임포트

function CommentForm({ postId, onAddComment, initialComment, onCancelEdit }) {
    const [commentText, setCommentText] = useState('');

    useEffect(() => {
        if (initialComment) {
            setCommentText(initialComment.comment);
        } else {
            setCommentText('');
        }
    }, [initialComment]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (commentText.trim() === '') return;

        onAddComment({ postId, comment: commentText, commentId: initialComment?.commentId });
        setCommentText('');
        if (onCancelEdit) {
            onCancelEdit();
        }
    };

    return (
        <form onSubmit={handleSubmit} className="comment-form-container">
            <textarea
                className="comment-textarea"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder={initialComment ? "댓글 수정..." : "댓글을 작성하세요..."}
                rows="3"
            ></textarea>
            <div className="comment-form-actions">
                <button type="submit" className="comment-submit-button">
                    {initialComment ? "댓글 수정" : "댓글 등록"}
                </button>
                {initialComment && (
                    <button type="button" onClick={onCancelEdit} className="comment-cancel-button">
                        취소
                    </button>
                )}
            </div>
        </form>
    );
}

export default CommentForm;
