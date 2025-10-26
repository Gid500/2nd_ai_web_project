import React, { useState } from 'react';
import useInput from '../hook/useInput';

const PostForm = ({ onSubmit, initialData = {}, onCancel }) => {
    const isEditMode = !!initialData.postId;

    const postTitle = useInput(initialData.postTitle || '');
    const postContent = useInput(initialData.postContent || '');
    const [isNotice, setIsNotice] = useState(initialData.isNotice || false);

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = {
            postTitle: postTitle.value,
            postContent: postContent.value,
            isNotice: isNotice,
        };
        onSubmit(data);
    };

    return (
        <div>
            <h2>{isEditMode ? '게시글 수정' : '새 게시글 작성'}</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>제목:</label>
                    <input type="text" {...postTitle} required />
                </div>
                <div>
                    <label>내용:</label>
                    <textarea {...postContent} rows="10" required />
                </div>
                <div>
                    <label>공지사항:</label>
                    <input type="checkbox" checked={isNotice} onChange={(e) => setIsNotice(e.target.checked)} />
                </div>
                <button type="submit">{isEditMode ? '수정' : '작성'}</button>
                <button type="button" onClick={onCancel}>취소</button>
            </form>
        </div>
    );
};

export default PostForm;
