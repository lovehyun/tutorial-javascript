import { Todo } from './todo';

const todos: Todo[] = [];

function addTodo(title: string): void {
    const newTodo: Todo = { id: Date.now(), title, completed: false };
    todos.push(newTodo);
    console.log('Todo added:', newTodo);
}

addTodo('Learn TypeScript');
console.log('Todos:', todos);
