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
            </ul>
        </div>
    );
}

export default Posts;
