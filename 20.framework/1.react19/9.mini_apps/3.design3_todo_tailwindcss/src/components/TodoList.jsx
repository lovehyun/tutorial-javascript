export default function TodoList({ todos, onToggle, onRemove }) {
    return (
        <ul className="list">
            {todos.map((t) => (
                <li key={t.id} className="item" onClick={() => onToggle(t.id)}>
                    <span className={t.done ? "done" : ""}>{t.text}</span>
                    <button
                        className="btn-danger"
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
