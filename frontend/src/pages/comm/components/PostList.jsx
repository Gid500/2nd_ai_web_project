import React from 'react';

const PostList = ({ posts, onViewDetail, onEdit, onDelete }) => {
    // Sort posts: notices first, then by createdDate (newest first)
    const sortedPosts = [...posts].sort((a, b) => {
        // If both are notices or both are not notices, sort by createdDate
        if (a.isNotice === b.isNotice) {
            return new Date(b.createdDate) - new Date(a.createdDate);
        }
        // Notices come before non-notices
        return b.isNotice - a.isNotice;
    });

    return (
        <div>
            <h2>게시글 목록</h2>
            {sortedPosts.length === 0 ? (
                <p>게시글이 없습니다.</p>
            ) : (
                <ul>
                    {sortedPosts.map(post => (
                        <li key={post.postId} style={{ border: post.isNotice ? '2px solid #ffcc00' : 'none', padding: '10px', marginBottom: '10px' }}>
                            <h3 onClick={() => onViewDetail(post.postId)} style={{ cursor: 'pointer' }}>
                                {post.isNotice && <span style={{ marginRight: '10px', color: 'red', fontWeight: 'bold' }}>[공지]</span>}
                                {post.postTitle}
                            </h3>
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
