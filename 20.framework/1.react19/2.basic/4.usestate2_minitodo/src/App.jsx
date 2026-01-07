import { useMemo, useState } from 'react';
import TodoForm from './components/TodoForm.jsx';
import TodoList from './components/TodoList.jsx';

export default function App() {
    // 목록(리스트 렌더링 대상)
    const [todos, setTodos] = useState([
        { id: 1, text: 'Vite 실행하기', done: true },
        { id: 2, text: '조건부 렌더링 이해하기', done: false },
    ]);

    // 폼 입력(Controlled)
    const [text, setText] = useState('');
    const [showDone, setShowDone] = useState(true); // 조건부 렌더링(필터)

    const visibleTodos = useMemo(() => {
        return showDone ? todos : todos.filter((t) => !t.done);
    }, [todos, showDone]);

    const doneCount = useMemo(() => todos.filter((t) => t.done).length, [todos]);

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
        setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
    }

    function removeTodo(id) {
        setTodos((prev) => prev.filter((t) => t.id !== id));
    }

    return (
        <div style={{ padding: 16, maxWidth: 520 }}>
            <h1>Mini Todo</h1>

            {/* 조건부 렌더링: 통계/상태 표시 */}
            {todos.length === 0 ? (
                <p>할 일이 없습니다. 첫 할 일을 추가해보세요.</p>
            ) : (
                <p>
                    전체: {todos.length} / 완료: {doneCount}
                </p>
            )}

            {/* 폼 입력 + 제출 */}
            <TodoForm text={text} setText={setText} onAdd={addTodo} />

            {/* 조건부 렌더링: 필터 토글 */}
            <div style={{ marginTop: 12 }}>
                <label style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <input type="checkbox" checked={showDone} onChange={(e) => setShowDone(e.target.checked)} />
                    완료 항목도 보기
                </label>
            </div>

            {/* 리스트 렌더링 */}
            <TodoList todos={visibleTodos} onToggle={toggleTodo} onRemove={removeTodo} />

            {/* 조건부 렌더링: 필터 결과가 비었을 때 */}
            {!showDone && visibleTodos.length === 0 && todos.length > 0 && (
                <p style={{ marginTop: 12 }}>미완료 항목이 없습니다 🎉</p>
            )}
        </div>
    );
}
