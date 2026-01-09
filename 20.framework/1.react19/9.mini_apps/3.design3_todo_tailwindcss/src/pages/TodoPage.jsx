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
            <h1 className="heading">📝 Todo</h1>
            <TodoInput onAdd={addTodo} />
            <TodoList todos={todos} onToggle={toggleTodo} onRemove={removeTodo} />
        </div>
    );
}
