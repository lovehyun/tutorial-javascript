export default function TodoList({ todos, onToggle, onRemove }) {
    return (
        <ul className="list-group">
            {todos.map((t) => (
                <li
                    key={t.id}
                    className="list-group-item d-flex justify-content-between align-items-center"
                    role="button"
                    onClick={() => onToggle(t.id)}
                >
                    <span className={t.done ? 'text-decoration-line-through text-secondary' : ''}>{t.text}</span>

                    <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={(e) => {
                            e.stopPropagation();
                            onRemove(t.id);
                        }}
                    >
                        삭제
                    </button>
                </li>
            ))}
        </ul>
    );
}
