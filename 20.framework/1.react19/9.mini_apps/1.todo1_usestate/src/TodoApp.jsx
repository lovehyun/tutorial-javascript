import { useState } from 'react';

export default function TodoApp() {
    // 목록(리스트 렌더링 대상)
    const [todos, setTodos] = useState([
        { id: 1, text: 'Vite 실행하기', done: true },
        { id: 2, text: '조건부 렌더링 이해하기', done: false },
    ]);

    // 폼 입력(Controlled)
    const [text, setText] = useState('');

    function addTodo(e) {
        e.preventDefault();

        const trimmed = text.trim();
        if (!trimmed) return;

        const newTodo = {
            id: Date.now(), // 간단한 예제용 id
            text: trimmed,
            done: false,
        };

        setTodos((prev) => [newTodo, ...prev]);
        // setText('');
    }

    function toggleTodo(id) {
        setTodos((prev) =>
            prev.map((t) => {
                if (t.id !== id) return t;
                return { ...t, done: !t.done };
            })
        );
    }

    return (
        <div>
            <h1>Mini Todo</h1>

            {/* Todo 입력폼 */}
            <form onSubmit={addTodo}>
                <input
                    // value={text} // 추후 입력 완료 후 클리어용
                    onChange={(e) => setText(e.target.value)}
                    placeholder="할 일을 입력하세요"
                />
                <button type="submit">추가</button>
            </form>

            {/* Todo 리스트 */}
            {/* {todos.length !== 0  */} {/* 무방. 의미를 명확히 부여 (리스트가 0 이 아님) */}
                <ul>
                    {todos.map((t) => (
                        <li key={t.id}>
                            <label>
                                <input
                                    type="checkbox"
                                    checked={t.done}
                                    onChange={() => toggleTodo(t.id)}
                                />
                                <span style={{ textDecoration: t.done ? 'line-through' : 'none' }}>
                                    {t.text}
                                </span>
                            </label>
                        </li>
                    ))}
                </ul>
            {/* )} */}
        </div>
    );
}
