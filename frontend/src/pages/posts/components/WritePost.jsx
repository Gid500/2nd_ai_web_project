import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useInput from '../../../common/hook/useInput';
import '../../../asset/css/WritePost.css';

function WritePost({ setPosts }) {
    const [title, handleTitleChange] = useInput('');
    const [content, setContent] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        const newPost = {
            id: Date.now(), // Simple unique ID for now
            title,
            content,
            author: 'Anonymous', // Placeholder author
            date: new Date().toISOString().slice(0, 10), // Current date
        };
        setPosts(prevPosts => [...prevPosts, newPost]);
        navigate('/posts');
    };

    const handleContentChange = (e) => {
        setContent(e.target.value);
    };

    return (
        <div className="write-post-container">
            <h1>Write a New Post</h1>
            <form onSubmit={handleSubmit} className="write-post-form">
                <div className="form-group">
                    <label htmlFor="title">Title</label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={handleTitleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="content">Content</label>
                    <textarea
                        id="content"
                        className="content-editable"
                        value={content}
                        onChange={handleContentChange}
                    />
                </div>
                <button type="submit" className="submit-button">Submit Post</button>
            </form>
        </div>
    );
}

export default WritePost;
