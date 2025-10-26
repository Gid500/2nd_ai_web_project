import React from 'react';
import { useAuth } from '../../../common/hook/useAuth';
import './PostDetail.css';

// 백엔드 기본 URL (환경 변수 또는 설정 파일에서 가져오는 것이 좋지만, 일단 하드코딩)
const BACKEND_BASE_URL = 'http://localhost:8080';

const PostDetail = ({ post, onBackToList, onEdit, onDelete }) => {
    const { user, isAdmin } = useAuth();

    if (!post) {
        return <p>게시글을 찾을 수 없습니다.</p>;
    }

    const decodedContent = post.postContent || '';

    return (
        <div className="post-detail-container">
            <h2 className="post-detail-title">
                {post.isNotice && <span className="post-detail-notice-tag">[공지]</span>}
                {post.postTitle}
            </h2>
            <p className="post-detail-meta-info">작성자: {post.anoyUserName || post.userId}</p>
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
                        <button onClick={() => onEdit(post)}>수정</button>
                        <button onClick={() => onDelete(post.postId)}>삭제</button>
                    </>
                )}
            </div>
        </div>
    );
};

export default PostDetail;
