import { useMemo, useState } from 'react';
import TodoForm from './components/TodoForm.jsx';
import TodoList from './components/TodoList.jsx';

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
        setText('');
    }

    function toggleTodo(id) {
        setTodos((prev) => 
            prev.map((t) => 
                (t.id === id 
                    ? { ...t, done: !t.done } 
                    : t)));
    }

    function removeTodo(id) {
        setTodos((prev) => 
            prev.filter((t) => 
                t.id !== id));
    }

    return (
        <div style={{ padding: 16, maxWidth: 520 }}>
            <h1>Mini Todo</h1>

            {/* 조건부 렌더링: 통계/상태 표시 */}
            {todos.length === 0 && (
                <p>할 일이 없습니다. 첫 할 일을 추가해보세요.</p>
            )}

            {/* 폼 입력 + 제출 */}
            <TodoForm text={text} setText={setText} onAdd={addTodo} />

            {/* 리스트 렌더링 */}
            <TodoList todos={todos} onToggle={toggleTodo} onRemove={removeTodo} />
        </div>
    );
}
