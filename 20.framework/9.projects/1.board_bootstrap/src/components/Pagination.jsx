export default function Pagination({ page, totalPages, onPageChange }) {
    const windowSize = 5;
    const half = Math.floor(windowSize / 2);

    let start = Math.max(1, page - half);
    let end = Math.min(totalPages, start + windowSize - 1);
    start = Math.max(1, end - windowSize + 1);

    const nums = [];
    for (let i = start; i <= end; i++) nums.push(i);

    return (
        <nav aria-label="pagination">
            <ul className="pagination justify-content-center flex-wrap">
                <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={() => onPageChange(1)}>
                        &laquo;
                    </button>
                </li>
                <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={() => onPageChange(page - 1)}>
                        &lsaquo;
                    </button>
                </li>

                {nums.map((n) => (
                    <li key={n} className={`page-item ${n === page ? 'active' : ''}`}>
                        <button className="page-link" onClick={() => onPageChange(n)}>
                            {n}
                        </button>
                    </li>
                ))}

                <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={() => onPageChange(page + 1)}>
                        &rsaquo;
                    </button>
                </li>
                <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={() => onPageChange(totalPages)}>
                        &raquo;
                    </button>
                </li>
            </ul>
        </nav>
    );
}
