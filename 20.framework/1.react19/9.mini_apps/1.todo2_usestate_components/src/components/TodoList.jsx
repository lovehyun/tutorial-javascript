export default function TodoList({ todos, onToggle }) {
    // 조건부 렌더링: 목록이 비었을 때
    if (todos.length === 0) return null;

    // 리스트 렌더링
    return (
        <ul style={{ marginTop: 12, paddingLeft: 16 }}>
            
            {todos.map((t) => (
                <li key={t.id} style={{ marginBottom: 8 }}>
                    <label style={{ display: 'flex', gap: 8, alignItems: 'center' }}> {/* 한 줄의 범위를 정의해서 이벤트 범위를 input checkbox와 span글자까지 포함되도록 */}
                        <input type="checkbox" checked={t.done} onChange={() => onToggle(t.id)} />

                        <span style={{ textDecoration: t.done ? 'line-through' : 'none' }}>{t.text}</span>
                    </label>
                </li>
            ))}

        </ul>
    );
}
