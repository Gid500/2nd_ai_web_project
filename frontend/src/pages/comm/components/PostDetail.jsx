import React from 'react';
import { useAuth } from '../../../common/hook/useAuth';

const PostDetail = ({ post, onBackToList, onEdit, onDelete }) => {
    const { user, isAdmin } = useAuth();

    if (!post) {
        return <p>게시글을 찾을 수 없습니다.</p>;
    }

    const decodedContent = post.postContent || '';

    return (
        <div>
            <h2>{post.isNotice && <span style={{ marginRight: '10px', color: 'red', fontWeight: 'bold' }}>[공지]</span>}{post.postTitle}</h2>
            <p>작성자: {post.anoyUserName || post.userId}</p>
            <p>작성일: {new Date(post.createdDate).toLocaleString()}</p>
            <div>
                <h3>내용:</h3>
                <p>{decodedContent}</p>
            </div>
            {post.files && post.files.length > 0 && (
                <div>
                    <h3>첨부 파일:</h3>
                    <ul>
                        {post.files.map(file => (
                            <li key={file.fileId}>
                                <a href={file.imgUrl} target="_blank" rel="noopener noreferrer">{file.uploadName}</a>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            <button onClick={onBackToList}>목록으로 돌아가기</button>
            {(isAdmin || (user && user.userId === post.userId)) && (
                <>
                    <button onClick={() => onEdit(post)}>수정</button>
                    <button onClick={() => onDelete(post.postId)}>삭제</button>
                </>
            )}
        </div>
    );
};

export default PostDetail;
