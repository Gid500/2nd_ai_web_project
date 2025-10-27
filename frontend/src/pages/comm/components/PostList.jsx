import React from 'react';
import { useAuth } from '../../../common/hook/useAuth';
import './PostList.css';
import { useNavigate, Link } from 'react-router-dom'; // useNavigate, Link 임포트

const PostList = ({ posts, currentUser }) => {
    const { user, isAdmin } = useAuth();
    const navigate = useNavigate(); // useNavigate 훅 사용

    // Sort posts: notices first, then by createdDate (newest first)
    const sortedPosts = [...posts].sort((a, b) => {
        // If both are notices or both are not notices, sort by createdDate
        if (a.isNotice === b.isNotice) {
            return new Date(b.createdDate) - new Date(a.createdDate);
        }
        // Notices come before non-notices
        return b.isNotice - a.isNotice;
    });

    const handleEdit = (post) => {
        // PostDetail에서 onEdit을 호출할 때 navigate를 사용하도록 변경
        // 여기서는 PostList에서 직접 수정 버튼을 누를 일이 없으므로 onEdit prop은 제거
    };

    const handleDelete = (id) => {
        // PostDetail에서 onDelete를 호출할 때 navigate를 사용하도록 변경
        // 여기서는 PostList에서 직접 삭제 버튼을 누를 일이 없으므로 onDelete prop은 제거
    };

    return (
        <div className="post-list-container">
            <div className="post-list-header">
                <h2 className="post-list-title">게시글 목록</h2>
                {currentUser && ( // 로그인된 사용자에게만 버튼 표시
                    <Link to="/comm/new" className="comm-create-post-button">새 게시글 작성</Link>
                )}
            </div>
            {sortedPosts.length === 0 ? (
                <p className="post-list-empty">게시글이 없습니다.</p>
            ) : (
                <ul className="post-list-ul">
                    {sortedPosts.map(post => (
                        <li key={post.postId} className={`post-list-item ${post.isNotice ? 'notice' : ''}`}>
                            <Link to={`/comm/${post.postId}`} className="post-list-item-title-link">
                                <h3 className="post-list-item-title">
                                    {post.isNotice && <span className="post-list-notice-tag">[공지]</span>}
                                    {post.postTitle}
                                </h3>
                            </Link>
                            <p className="post-list-meta-info">작성자: {post.anoyUserName || post.userId}</p>
                            <p className="post-list-meta-info">작성일: {new Date(post.createdDate).toLocaleString()}</p>
                            {(isAdmin || (user && user.userId === post.userId)) && (
                                <div className="post-list-actions">
                                    {/* PostList에서는 수정/삭제 버튼을 직접 렌더링하지 않고 PostDetail에서 처리 */}
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
