import React from 'react';

const PostDetail = ({ post, onBackToList }) => {
    if (!post) {
        return <p>게시글을 찾을 수 없습니다.</p>;
    }

    // Assuming postContent is a byte array or similar that needs decoding
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
        </div>
    );
};

export default PostDetail;
