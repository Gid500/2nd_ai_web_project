import React from 'react';
import { useAuth } from '../../../common/hook/useAuth';
import './PostList.css';

const PostList = ({ posts, onViewDetail, onEdit, onDelete }) => {
    const { user, isAdmin } = useAuth();

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
        <div className="post-list-container">
            <h2 className="post-list-title">게시글 목록</h2>
            {sortedPosts.length === 0 ? (
                <p className="post-list-empty">게시글이 없습니다.</p>
            ) : (
                <ul className="post-list-ul">
                    {sortedPosts.map(post => (
                        <li key={post.postId} className={`post-list-item ${post.isNotice ? 'notice' : ''}`}>
                            <h3 onClick={() => onViewDetail(post.postId)} className="post-list-item-title">
                                {post.isNotice && <span className="post-list-notice-tag">[공지]</span>}
                                {post.postTitle}
                            </h3>
                            <p className="post-list-meta-info">작성자: {post.anoyUserName || post.userId}</p>
                            <p className="post-list-meta-info">작성일: {new Date(post.createdDate).toLocaleString()}</p>
                            {(isAdmin || (user && user.userId === post.userId)) && (
                                <div className="post-list-actions">
                                    <button onClick={() => onEdit(post)}>수정</button>
                                    <button onClick={() => onDelete(post.postId)}>삭제</button>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default PostList;
