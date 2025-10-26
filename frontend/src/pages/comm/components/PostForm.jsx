import React, { useState, useEffect } from 'react';
import useInput from '../hook/useInput';
import { useAuth } from '../../../common/hook/useAuth';
import './PostForm.css';

const PostForm = ({ onSubmit, initialData = {}, onCancel }) => {
    const isEditMode = !!initialData.postId;
    const { user, isAdmin } = useAuth(); // isAdmin 다시 가져오기

    const postTitle = useInput(initialData.postTitle || '');
    const postContent = useInput(initialData.postContent || '');
    const [postType, setPostType] = useState(initialData.isNotice ? 'notice' : 'general');
    const [selectedFiles, setSelectedFiles] = useState([]); // 새로 선택된 파일
    const [existingFiles, setExistingFiles] = useState(initialData.files || []); // 기존 파일
    const [deletedFileIds, setDeletedFileIds] = useState([]); // 삭제할 파일 ID 목록

    useEffect(() => {
        setPostType(initialData.isNotice ? 'notice' : 'general');
        setExistingFiles(initialData.files || []);
        setDeletedFileIds([]); // 초기화
    }, [initialData]);

    const handleFileChange = (e) => {
        setSelectedFiles(Array.from(e.target.files));
    };

    const handleRemoveExistingFile = (fileId) => {
        setDeletedFileIds(prev => [...prev, fileId]); // 삭제할 파일 ID 목록에 추가
        setExistingFiles(existingFiles.filter(file => file.fileId !== fileId)); // UI에서 제거
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        const postData = {
            postId: initialData.postId, // postId 추가
            postTitle: postTitle.value,
            postContent: postContent.value,
            isNotice: postType === 'notice',
            deletedFileIds: deletedFileIds, // 삭제할 파일 ID 목록 포함
            userId: user ? user.userId : null, // user_id 추가
        };

        formData.append('post', new Blob([JSON.stringify(postData)], { type: 'application/json' }));

        selectedFiles.forEach(file => {
            formData.append('files', file);
        });

        onSubmit(formData); // FormData 객체 전달
    };

    const postOptions = [];
    if (isAdmin) { // isAdmin 조건 다시 추가
        postOptions.push({ value: 'notice', label: '공지사항' });
    }
    postOptions.push({ value: 'general', label: '일반' });

    return (
        <div className="post-form-container">
            <h2 className="post-form-title">{isEditMode ? '게시글 수정' : '새 게시글 작성'}</h2>
            <form onSubmit={handleSubmit}>
                <div className="post-form-group">
                    <label htmlFor="postTitle">제목:</label>
                    <input type="text" id="postTitle" {...postTitle} required />
                </div>
                <div className="post-form-group">
                    <label htmlFor="postContent">내용:</label>
                    <textarea id="postContent" {...postContent} rows="10" required />
                </div>
                <div className="post-form-group">
                    <label htmlFor="postType">게시글 유형:</label>
                    <select id="postType" value={postType} onChange={(e) => setPostType(e.target.value)}>
                        {postOptions.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>
                {isEditMode && existingFiles.length > 0 && (
                    <div className="post-form-group">
                        <label>기존 파일:</label>
                        <ul className="post-form-file-list">
                            {existingFiles.map(file => (
                                <li key={file.fileId} className="post-form-file-item">
                                    {file.uploadName}
                                    <button type="button" onClick={() => handleRemoveExistingFile(file.fileId)}>X</button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                <div className="post-form-group">
                    <label htmlFor="fileUpload">파일 첨부:</label>
                    <input type="file" id="fileUpload" multiple onChange={handleFileChange} />
                </div>
                <div className="post-form-actions">
                    <button type="submit">{isEditMode ? '수정' : '작성'}</button>
                    <button type="button" onClick={onCancel}>취소</button>
                </div>
            </form>
        </div>
    );
};

export default PostForm;
