import { useState } from 'react';
import TodoInput from '../components/TodoInput';
import TodoList from '../components/TodoList';

export default function TodoPage() {
    const [todos, setTodos] = useState([]);

    const addTodo = (text) => {
        const t = text.trim();
        if (!t) return;
        setTodos((prev) => [{ id: crypto.randomUUID(), text: t, done: false }, ...prev]);
    };

    const toggleTodo = (id) => {
        setTodos((prev) => prev.map((x) => (x.id === id ? { ...x, done: !x.done } : x)));
    };

    const removeTodo = (id) => {
        setTodos((prev) => prev.filter((x) => x.id !== id));
    };

    return (
        <div className="card">
            <div className="card-body">
                <h5 className="card-title mb-3">📝 Todo</h5>

                <TodoInput onAdd={addTodo} />
                <TodoList todos={todos} onToggle={toggleTodo} onRemove={removeTodo} />

                {todos.length === 0 && <div className="mt-3 text-secondary">할 일을 추가해보세요.</div>}
            </div>
        </div>
    );
}
