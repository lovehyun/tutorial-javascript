import React, { useState, useEffect } from 'react';
import { FaTrash } from 'react-icons/fa';
import './TodoApp.css';
import api from './api';

const TodoApp = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');

  useEffect(() => {
    // Express 서버에서 데이터를 불러와서 설정
    fetch('http://localhost:5000/todos')
      .then(response => response.json())
      .then(data => setTodos(data))
      .catch(error => console.error('Error fetching todos:', error));
  }, []);

  const addTodo = () => {
    if (newTodo.trim() !== '') {
      // Express 서버에 새로운 Todo를 추가
      fetch('http://localhost:5000/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: newTodo, completed: false }),
      })
        .then(response => response.json())
        .then(data => setTodos([...todos, data]))
        .catch(error => console.error('Error adding todo:', error));

      setNewTodo('');
    }
  };

  const deleteTodo = (id) => {
    // Express 서버에서 Todo 삭제
    fetch(`http://localhost:5000/todos/${id}`, {
      method: 'DELETE',
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          const updatedTodos = todos.filter(todo => todo.id !== id);
          setTodos(updatedTodos);
        }
      })
      .catch(error => console.error('Error deleting todo:', error));
  };

  return (
    // ... (이전 코드와 동일)
  );
};

export default TodoApp;
