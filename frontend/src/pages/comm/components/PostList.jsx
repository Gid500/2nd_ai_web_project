import React from 'react';

const PostList = ({ posts, onViewDetail, onEdit, onDelete }) => {
    return (
        <div>
            <h2>게시글 목록</h2>
            {posts.length === 0 ? (
                <p>게시글이 없습니다.</p>
            ) : (
                <ul>
                    {posts.map(post => (
                        <li key={post.postId}>
                            <h3 onClick={() => onViewDetail(post.postId)} style={{ cursor: 'pointer' }}>{post.postTitle}</h3>
                            <p>작성자: {post.anoyUserName || post.userId}</p>
                            <p>작성일: {new Date(post.createdDate).toLocaleString()}</p>
                            <button onClick={() => onEdit(post)}>수정</button>
                            <button onClick={() => onDelete(post.postId)}>삭제</button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default PostList;
