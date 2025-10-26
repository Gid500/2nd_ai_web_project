import React, { useState } from 'react';
import './NoticeSection.css';

const NoticeSection = ({ notices, onViewDetail }) => {
    const [expanded, setExpanded] = useState(false);

    const displayedNotices = expanded ? notices : notices.slice(0, 2);

    if (notices.length === 0) {
        return null; // 공지사항이 없으면 섹션을 렌더링하지 않음
    }

    return (
        <div className="notice-section-container">
            <h2 className="notice-section-header">공지사항</h2>
            <ul className="notice-list-ul">
                {displayedNotices.map(notice => (
                    <li key={notice.postId} className="notice-list-item">
                        <h3 onClick={() => onViewDetail(notice.postId)} className="notice-item-title">
                            [공지] {notice.postTitle}
                        </h3>
                        <p className="notice-item-meta">작성일: {new Date(notice.createdDate).toLocaleString()}</p>
                    </li>
                ))}
            </ul>
            {notices.length > 2 && (
                <button onClick={() => setExpanded(!expanded)} className="notice-expand-button">
                    {expanded ? '공지 접기' : '공지 더보기'}
                </button>
            )}
        </div>
    );
};

export default NoticeSection;
