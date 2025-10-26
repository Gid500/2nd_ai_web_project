import React, { useState } from 'react';
import { updateComment, deleteComment } from '../api/commentApi';
import { useAuth } from '../../../common/hook/AuthProvider'; // useAuth 훅 경로 확인 필요

const CommentItem = ({ comment, onCommentUpdated, onCommentDeleted }) => {
    const { token, user } = useAuth(); // 현재 로그인한 사용자 정보와 토큰 가져오기
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(comment.content);

    const handleUpdate = async () => {
        try {
            await updateComment(comment.commentId, { content: editedContent, userId: user.userId }, token);
            onCommentUpdated();
            setIsEditing(false);
        } catch (error) {
            console.error('Failed to update comment:', error);
            alert('댓글 수정에 실패했습니다.');
        }
    };

    const handleDelete = async () => {
        if (window.confirm('정말로 이 댓글을 삭제하시겠습니까?')) {
            try {
                await deleteComment(comment.commentId, token);
                onCommentDeleted();
            } catch (error) {
                console.error('Failed to delete comment:', error);
                alert('댓글 삭제에 실패했습니다.');
            }
        }
    };

    // 현재 로그인한 사용자가 댓글 작성자인지 또는 관리자인지 확인
    const isAuthor = user && user.userId === comment.userId;
    const isAdmin = user && user.roles && user.roles.includes('ROLE_ADMIN'); // 사용자 역할에 따라 변경될 수 있음

    return (
        <div className="comment-item">
            <p className="comment-author">{comment.userName}</p>
            <p className="comment-date">{new Date(comment.createdAt).toLocaleString()}</p>
            {isEditing ? (
                <div>
                    <textarea
                        value={editedContent}
                        onChange={(e) => setEditedContent(e.target.value)}
                    />
                    <button onClick={handleUpdate}>저장</button>
                    <button onClick={() => setIsEditing(false)}>취소</button>
                </div>
            ) : (
                <div>
                    <p className="comment-content">{comment.content}</p>
                    {(isAuthor || isAdmin) && (
                        <div className="comment-actions">
                            <button onClick={() => setIsEditing(true)}>수정</button>
                            <button onClick={handleDelete}>삭제</button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default CommentItem;