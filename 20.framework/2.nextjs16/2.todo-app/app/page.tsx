"use client"; // 클라이언트 컴포넌트로 지정

import { useState, FormEvent } from "react";

type Todo = {
  id: number;
  text: string;
  done: boolean;
};

export default function Page() {
  // 할 일 목록 상태
  const [todos, setTodos] = useState<Todo[]>([]);
  // 입력창 상태
  const [input, setInput] = useState("");

  // 폼 제출(추가) 핸들러
  const handleAdd = (e: FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;

    const newTodo: Todo = {
      id: Date.now(), // 간단한 id (실무에서는 uuid 등 사용 권장)
      text,
      done: false,
    };

    setTodos((prev) => [newTodo, ...prev]);
    setInput("");
  };

  // 완료 체크 토글
  const toggleTodo = (id: number) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, done: !todo.done } : todo
      )
    );
  };

  // 삭제
  const removeTodo = (id: number) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        paddingTop: "80px",
        background: "#f4f4f5",
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      <section
        style={{
          width: "100%",
          maxWidth: "420px",
          background: "white",
          borderRadius: "16px",
          padding: "24px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
        }}
      >
        <h1
          style={{
            fontSize: "1.5rem",
            fontWeight: 700,
            marginBottom: "16px",
          }}
        >
          📝 간단 TODO 리스트
        </h1>

        {/* 입력 폼 */}
        <form
          onSubmit={handleAdd}
          style={{
            display: "flex",
            gap: "8px",
            marginBottom: "16px",
          }}
        >
          <input
            type="text"
            placeholder="할 일을 입력하세요..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            style={{
              flex: 1,
              padding: "8px 10px",
              borderRadius: "8px",
              border: "1px solid #e4e4e7",
              fontSize: "0.95rem",
            }}
          />
          <button
            type="submit"
            style={{
              padding: "8px 14px",
              borderRadius: "8px",
              border: "none",
              background: "#2563eb",
              color: "white",
              fontSize: "0.9rem",
              fontWeight: 600,
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            추가
          </button>
        </form>

        {/* 목록 */}
        {todos.length === 0 ? (
          <p
            style={{
              fontSize: "0.9rem",
              color: "#71717a",
            }}
          >
            아직 할 일이 없습니다. 위에서 새 할 일을 추가해 보세요.
          </p>
        ) : (
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            {todos.map((todo) => (
              <li
                key={todo.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "8px 10px",
                  borderRadius: "8px",
                  background: "#f9fafb",
                  border: "1px solid #e5e7eb",
                }}
              >
                <input
                  type="checkbox"
                  checked={todo.done}
                  onChange={() => toggleTodo(todo.id)}
                />
                <span
                  style={{
                    flex: 1,
                    fontSize: "0.95rem",
                    textDecoration: todo.done ? "line-through" : "none",
                    color: todo.done ? "#9ca3af" : "#111827",
                  }}
                >
                  {todo.text}
                </span>
                <button
                  type="button"
                  onClick={() => removeTodo(todo.id)}
                  style={{
                    border: "none",
                    background: "transparent",
                    color: "#ef4444",
                    fontSize: "0.8rem",
                    cursor: "pointer",
                  }}
                >
                  삭제
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
