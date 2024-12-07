import React from 'react';

const SortOptions = ({ sortOrder, onSortChange }) => {
    return (
        <div className="sort-options">
            <select
                id="sort-order"
                value={sortOrder}
                onChange={(e) => onSortChange(e.target.value)}
            >
                <option value="newest">최신순</option>
                <option value="oldest">오래된 순</option>
                <option value="alphabetical">알파벳순</option>
            </select>
        </div>
    );
};

export default SortOptions;
