import React from 'react';
import { useParams, Link } from 'react-router-dom';
import '../../../asset/css/PostDetail.css';

function PostDetail({ posts }) {
    const { id } = useParams();
    const post = posts.find(p => p.id === parseInt(id));

    if (!post) {
        return <div>Post not found</div>;
    }

    return (
        <div className="post-detail-container">
            <div className="post-detail-header">
                <h1>{post.title}</h1>
                <div className="post-detail-meta">
                    <span>By {post.author}</span> | <span>{post.date}</span>
                </div>
            </div>
            <div className="post-detail-content">
                <p>{post.content}</p>
            </div>
            <Link to="/posts" className="back-link">Back to Posts</Link>
        </div>
    );
}

export default PostDetail;
