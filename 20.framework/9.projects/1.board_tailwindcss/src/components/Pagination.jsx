export default function Pagination({ page, totalPages, onPageChange }) {
    if (!totalPages || totalPages <= 1) return null;

    const windowSize = 7;
    const half = Math.floor(windowSize / 2);

    let start = Math.max(1, page - half);
    let end = Math.min(totalPages, start + windowSize - 1);
    start = Math.max(1, end - windowSize + 1);

    const nums = [];
    for (let i = start; i <= end; i++) nums.push(i);

    const base = 'h-10 min-w-10 px-3 rounded-xl text-sm font-semibold transition-all select-none';
    const neutral =
        'bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50 hover:ring-slate-300 active:scale-[0.98]';
    const active = 'bg-blue-600 text-white ring-1 ring-blue-600 shadow-sm shadow-blue-200 hover:bg-blue-500';
    const disabled = 'bg-slate-100 text-slate-400 ring-1 ring-slate-200 cursor-not-allowed';

    const Btn = ({ children, disabled: dis, onClick, ariaLabel }) => (
        <button
            type="button"
            aria-label={ariaLabel}
            className={`${base} ${dis ? disabled : neutral}`}
            disabled={dis}
            onClick={onClick}
        >
            {children}
        </button>
    );

    return (
        <div className="flex flex-wrap items-center justify-center gap-2">
            <Btn ariaLabel="first" disabled={page === 1} onClick={() => onPageChange(1)}>
                «
            </Btn>
            <Btn ariaLabel="prev" disabled={page === 1} onClick={() => onPageChange(page - 1)}>
                ‹
            </Btn>

            {start > 1 && (
                <>
                    <button type="button" className={`${base} ${neutral}`} onClick={() => onPageChange(1)}>
                        1
                    </button>
                    <span className="px-1 text-slate-400">…</span>
                </>
            )}

            {nums.map((n) => (
                <button
                    key={n}
                    type="button"
                    className={`${base} ${n === page ? active : neutral}`}
                    onClick={() => onPageChange(n)}
                    aria-current={n === page ? 'page' : undefined}
                >
                    {n}
                </button>
            ))}

            {end < totalPages && (
                <>
                    <span className="px-1 text-slate-400">…</span>
                    <button type="button" className={`${base} ${neutral}`} onClick={() => onPageChange(totalPages)}>
                        {totalPages}
                    </button>
                </>
            )}

            <Btn ariaLabel="next" disabled={page === totalPages} onClick={() => onPageChange(page + 1)}>
                ›
            </Btn>
            <Btn ariaLabel="last" disabled={page === totalPages} onClick={() => onPageChange(totalPages)}>
                »
            </Btn>
        </div>
    );
}
