import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Pagination.css';

const Pagination = ({ postsPerPage, totalPosts, currentPage, searchParams }) => {
    const navigate = useNavigate();
    const pageNumbers = [];
    const totalPages = Math.ceil(totalPosts / postsPerPage);

    // 최대 5개의 페이지 번호만 표시
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, currentPage + 2);

    if (totalPages <= 5) {
        startPage = 1;
        endPage = totalPages;
    } else {
        if (currentPage <= 3) {
            startPage = 1;
            endPage = 5;
        } else if (currentPage + 2 >= totalPages) {
            startPage = totalPages - 4;
            endPage = totalPages;
        }
    }

    for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
    }

    const goToPage = (pageNumber) => {
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.set('page', pageNumber);
        navigate(`/comm?${newSearchParams.toString()}`);
    };

    return (
        <nav>
            <ul className='pagination'>
                {currentPage > 1 && (
                    <li className="page-item">
                        <button onClick={() => goToPage(1)} className="page-link">
                            &lt;&lt;
                        </button>
                    </li>
                )}
                {currentPage > 1 && (
                    <li className="page-item">
                        <button onClick={() => goToPage(currentPage - 1)} className="page-link">
                            &lt;
                        </button>
                    </li>
                )}
                {pageNumbers.map(number => (
                    <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
                        <button onClick={() => goToPage(number)} className='page-link'>
                            {number}
                        </button>
                    </li>
                ))}
                {currentPage < totalPages && (
                    <li className="page-item">
                        <button onClick={() => goToPage(currentPage + 1)} className="page-link">
                            &gt;
                        </button>
                    </li>
                )}
                {currentPage < totalPages && (
                    <li className="page-item">
                        <button onClick={() => goToPage(totalPages)} className="page-link">
                            &gt;&gt;
                        </button>
                    </li>
                )}
            </ul>
        </nav>
    );
};

export default Pagination;
