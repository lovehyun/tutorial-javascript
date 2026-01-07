import { useState } from 'react';

function TodoApp({ theme }) {
    const [todos, setTodos] = useState([]);
    const [input, setInput] = useState('');

    const addTodo = () => {
        const text = input.trim()
        if (!text) return

        const newTodo = {
            id: crypto.randomUUID(), // 최신 브라우저 지원 (대부분 OK)
            text,
            done: false,
        }

        setTodos((prev) => [newTodo, ...prev])
        setInput('');
    };

    const toggleDone = (id) => {
        setTodos((prev) =>
            prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
        )
    };

    const removeTodo = (id) => {
        setTodos((prev) => prev.filter((t) => t.id !== id))
    };

    return (
        <div className={`card ${theme === 'dark' ? 'bg-secondary text-light' : ''}`}>
            <div className="card-body">
                <h5 className="card-title">📝 Todo List</h5>

                <div className="input-group mb-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="할 일을 입력하세요"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        // (옵셔널) 엔터로 추가
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') addTodo()
                        }}
                    />
                    <button className="btn btn-primary" onClick={addTodo}>
                        추가
                    </button>
                </div>

                <ul className="list-group">
                    {todos.map((t) => (
                        <li
                            key={t.id}
                            className={`list-group-item d-flex justify-content-between ${
                                theme === 'dark' ? 'bg-dark text-light' : ''
                            }`}
                            role="button"
                            onClick={() => toggleDone(t.id)}
                        >
                            <span
                                className={`${t.done ? 'text-decoration-line-through opacity-50' : ''}`}
                            >
                                {t.text}
                            </span>

                            <button 
                                className="btn btn-sm btn-danger" 
                                onClick={(e) => {
                                    e.stopPropagation() // 삭제 클릭이 토글로 전파되지 않게
                                    removeTodo(t.id)
                                }}
                            >
                                삭제
                            </button>
                        </li>
                    ))}
                </ul>

                {todos.length === 0 && (
                    <div className="mt-3 opacity-75">할 일을 추가해 보세요.</div>
                )}
            </div>
        </div>
    );
}

export default TodoApp;
