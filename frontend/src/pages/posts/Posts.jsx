import React from 'react';
import { Link } from 'react-router-dom';
import '../../asset/css/Posts.css';

function Posts({ posts }) {
    return (
        <div className="posts-container">
            <div className="posts-header">
                <h1>Posts</h1>
                <Link to="/posts/write" className="write-post-link">Write Post</Link>
            </div>
            <ul className="posts-list">
                {posts.map(post => (
                    <li key={post.id} className="post-item">
                        <Link to={`/posts/${post.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                            <h2>{post.title}</h2>
                            <p>{post.content}</p>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Posts;
