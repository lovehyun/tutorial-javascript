// package.json 만들기 (npm init -y)
// npm run build, npm start


// --------------------------------------------------------
// 예1) 인터페이스 없이 만든 단일 파일 예제
// Todo 배열 초기화
const todos2: { id: number; title: string; completed: boolean }[] = [];

// Todo 추가 함수
function addTodo2(id: number, title: string): void {
    const newTodo = { id, title, completed: false }; // 객체 구조 직접 정의
    todos2.push(newTodo);
    console.log('Todo added:', newTodo);
}

// 사용 예시
addTodo2(1, 'Learn TypeScript');
addTodo2(2, 'Practice TypeScript');
console.log('Todos:', todos2);


// --------------------------------------------------------
// 예2) ID 값을 저장하는 전역 변수
let currentId: number = 0;

// Todo 배열 초기화
const todos3: { id: number; title: string; completed: boolean }[] = [];

// Todo 추가 함수
function addTodo3(title: string): void {
    const newTodo = { id: ++currentId, title, completed: false }; // ID 자동 증가
    todos3.push(newTodo);
    console.log('Todo added:', newTodo);
}

// 사용 예시
addTodo3('Learn TypeScript');
addTodo3('Practice JavaScript');
addTodo3('Write Code');
console.log('Todos:', todos3);


// --------------------------------------------------------
// 예3/4) 인터페이스 사용 및 파일 분리(통합)

// export interface Todo {
//     id: number;
//     title: string;
//     completed: boolean;
// }

import { Todo } from './todo';

const todos: Todo[] = [];

function addTodo(title: string): void {
    const newTodo: Todo = { id: Date.now(), title, completed: false };
    todos.push(newTodo);
    console.log('Todo added:', newTodo);
}

addTodo('Learn TypeScript');
addTodo('Practice JavaScript');
console.log('Todos:', todos);
