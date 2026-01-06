export default function TodoList({ todos, onToggle, onRemove }) {
    // 조건부 렌더링: 목록이 비었을 때
    if (todos.length === 0) {
        return <p style={{ marginTop: 12 }}>표시할 항목이 없습니다.</p>;
    }

    // 리스트 렌더링
    return (
        <ul style={{ marginTop: 12, paddingLeft: 16 }}>
            {todos.map((t) => (
                <li key={t.id} style={{ marginBottom: 8 }}>
                    <label style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <input type="checkbox" checked={t.done} onChange={() => onToggle(t.id)} />
                        <span style={{ textDecoration: t.done ? 'line-through' : 'none' }}>{t.text}</span>
                        <button type="button" onClick={() => onRemove(t.id)} style={{ marginLeft: 'auto' }}>
                            삭제
                        </button>
                    </label>
                </li>
            ))}
        </ul>
    );
}
