import React from 'react';
import './Pagination.css';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    return (
        <div className="pagination">
            <button
                className="pagination-button"
                style={{ display: currentPage > 1 ? 'inline' : 'none' }}
                onClick={() => onPageChange(currentPage - 1)}
            >
                PREV
            </button>
            <span className="pagination-info">
                현재 페이지: {currentPage} / {totalPages}
            </span>
            <button
                className="pagination-button"
                style={{ display: currentPage < totalPages ? 'inline' : 'none' }}
                onClick={() => onPageChange(currentPage + 1)}
            >
                NEXT
            </button>
        </div>
    );
};

export default Pagination;
