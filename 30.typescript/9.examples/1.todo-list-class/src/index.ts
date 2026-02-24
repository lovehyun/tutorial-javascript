// main.ts
import { TodoManager } from './todoManager';

const manager = new TodoManager();

// 1) 할 일 추가
const todo1 = manager.addTodo('Learn TypeScript');
const todo2 = manager.addTodo('Practice JavaScript');

console.log('=== after add ===');
console.log(manager.listTodos());


// 2) 첫 번째 Todo 완료 처리 (toggle)
manager.toggleTodo(todo1.id);

console.log('=== after complete first ===');
console.log(manager.listTodos());


// 3) 두 번째 Todo 삭제
manager.removeTodo(todo2.id);

console.log('=== after remove second ===');
console.log(manager.listTodos());
