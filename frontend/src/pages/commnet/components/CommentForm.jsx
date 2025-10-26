import React, { useState } from 'react';
import { addComment } from '../api/commentApi';
import { useAuth } from '../../../common/hook/AuthProvider'; // useAuth 훅 경로 확인 필요

const CommentForm = ({ postId, onCommentAdded }) => {
    const { token, user } = useAuth(); // 현재 로그인한 사용자 정보와 토큰 가져오기
    const [content, setContent] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!content.trim()) {
            alert('댓글 내용을 입력해주세요.');
            return;
        }
        if (!user || !token) {
            alert('로그인이 필요합니다.');
            return;
        }

        try {
            await addComment({ postId, userId: user.userId, content }, token);
            setContent('');
            onCommentAdded();
        } catch (error) {
            console.error('Failed to add comment:', error);
            alert('댓글 작성에 실패했습니다.');
        }
    };

    if (!user) {
        return <p>댓글을 작성하려면 로그인해주세요.</p>;
    }

    return (
        <form className="comment-form" onSubmit={handleSubmit}>
            <textarea
                placeholder="댓글을 입력하세요..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
            />
            <button type="submit">댓글 작성</button>
        </form>
    );
};

export default CommentForm;