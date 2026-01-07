import { useMemo, useState } from 'react';
import TodoForm from './components/TodoForm.jsx';
import TodoList from './components/TodoList.jsx';

export default function TodoApp() {
    // 목록(리스트 렌더링 대상)
    const [todos, setTodos] = useState([
        { id: 1, text: 'Vite 실행하기', done: true },
        { id: 2, text: '조건부 렌더링 이해하기', done: false },
    ]);
    // todos : 현재 state 값
    // setTodos : state를 "바꿔달라고 요청"하는 함수
    // - 중요한 점
    //   - setTodos는 즉시 바꾸는 함수가 아닙니다.
    //   - "다음 렌더링 때 이 값으로 바꿔주세요" 라는 요청 큐에 등록합니다.
    // - 값을 설정하는 방법
    //   1. 값을 직접 넘기는 방식 (일반적인 set)
    //      setTodos(newTodos);
    //   2. 함수를 넘기는 방식 (functional updater)
    //      setTodos(prev => { return /* 새로운 todos */ });
    //      prev는 React가 넣어주는 값입니다
    // - 이렇게 구현된 이유? 
    //   - state 업데이트는 지연된 업데이트(비동기 + 배치 처리) 때문입니다.
    //   - setTodos([...todos, a]); 와 setTodos([...todos, b]); 가 있을 경우 둘다 같은 todos를 바라보고 실행 됨.

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

        setTodos((prev) => [newTodo, ...prev]); // 새로 할일을 앞에 추가
        setText('');
    }

    function toggleTodo(id) {
        // const todo = todos.find(t => t.id === id);
        // todo.done = !todo.done;
        
        // 주의: 이렇게 하면 안됨.
        // todos는 state
        // find로 가져온 todo는 기존 state 객체를 그대로 참조
        // 즉, state를 직접 수정(mutating) 하는 행위

        setTodos((prev) => 
            prev.map(t => {
                if (t.id !== id) return t;      // 그대로
                return { ...t, done: !t.done }  // 새로
            })
        );

        // 여기서 일어나는 일
        // - 배열 자체 → 새 배열
        // - 바뀐 todo → 새 객체
        // - 안 바뀐 todo → 기존 객체 재사용

        // [ A, B, C, D ]   ← prev 배열
        //     ↓ map
        // [ A, B, C', D ]  ← 새 배열
    }

    return (
        <div style={{ padding: 16, maxWidth: 520 }}>
            <h1>Mini Todo</h1>

            {/* 조건부 렌더링: 통계/상태 표시 */}
            {todos.length === 0 && <p>할 일이 없습니다. 첫 할 일을 추가해보세요.</p>}

            {/* 폼 입력 + 제출 */}
            <TodoForm text={text} setText={setText} onAdd={addTodo} />

            {/* 리스트 렌더링 */}
            <TodoList todos={todos} onToggle={toggleTodo} />
        </div>
    );
}
