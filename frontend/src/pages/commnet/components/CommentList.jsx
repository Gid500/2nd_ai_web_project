import React from 'react';
import CommentItem from './CommentItem';

const CommentList = ({ comments, onCommentUpdated, onCommentDeleted }) => {
    return (
        <div className="comment-list">
            <h3>댓글 ({comments.length})</h3>
            {comments.length === 0 ? (
                <p>아직 댓글이 없습니다.</p>
            ) : (
                comments.map((comment) => (
                    <CommentItem
                        key={comment.commentId}
                        comment={comment}
                        onCommentUpdated={onCommentUpdated}
                        onCommentDeleted={onCommentDeleted}
                    />
                ))
            )}
        </div>
    );
};

export default CommentList;