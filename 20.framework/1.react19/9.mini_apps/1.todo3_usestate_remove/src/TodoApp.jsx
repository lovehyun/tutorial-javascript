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

        // 가독성 향상 버전
        // setTodos(prev => {
        //     const filteredTodos = prev.filter(todo => todo.id !== id);
        //     return filteredTodos;
        // });

        // 아래처럼 상태를 직접 바꾸면 안됨 (해당 변수의 값을 직접 바꾸는 함수 사용 금지)
        // const index = todos.findIndex(t => t.id === id);
        // todos.splice(index, 1); // ❌
        // setTodos(todos);
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
