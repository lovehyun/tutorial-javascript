import React, { useState } from 'react';
// npm install react-icons
// https://react-icons.github.io/react-icons/
import { AiOutlineDelete } from 'react-icons/ai';
import { FaTrash } from 'react-icons/fa';
import './TodoApp.css'; // 스타일 파일을 불러옵니다.

const TodoApp = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');

  const addTodo = () => {
    if (newTodo.trim() !== '') {
      setTodos([...todos, { id: Date.now(), text: newTodo, completed: false }]);
      setNewTodo('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addTodo();
    }
  };

  const toggleTodo = (id) => {
    const updatedTodos = todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    setTodos(updatedTodos);
  };

  const deleteTodo = (id) => {
    const updatedTodos = todos.filter(todo => todo.id !== id);
    setTodos(updatedTodos);
  };

  return (
    <div class="todo-app">
      <h1>Todo App</h1>
      <div>
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="할 일을 입력하세요"
        />
        <button onClick={addTodo}>추가</button>
      </div>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id} className={todo.completed ? 'completed' : ''}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
            />
            <span>{todo.text}</span>
            {/* <button onClick={() => deleteTodo(todo.id)}>
              <AiOutlineDelete />
            </button> */}
            <FaTrash onClick={() => deleteTodo(todo.id)} className="delete-icon" style={{ fontSize: '20px' }} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoApp;
