// app/page.tsx
"use client";

import { useEffect, useState } from "react";

type Todo = {
  id: string;
  text: string;
  done: boolean;
};

export default function Page() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // 최초 로딩 시 서버에서 TODO 목록 가져오기
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const res = await fetch("/api/todos");
        if (!res.ok) throw new Error("failed to load");
        const data: Todo[] = await res.json();
        setTodos(data);
      } catch (e) {
        console.error(e);
      }
    };

    fetchTodos();
  }, []);

  // TODO 추가 (서버 POST)
  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const text = input.trim();
    if (!text || loading) return;

    setLoading(true);
    try {
      const res = await fetch("/api/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (!res.ok) throw new Error("failed to create");
      const newTodo: Todo = await res.json();

      setTodos((prev) => [newTodo, ...prev]);
      setInput("");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 완료 토글 (서버 PATCH)
  const toggleTodo = async (id: string, done: boolean) => {
    try {
      const res = await fetch("/api/todos", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, done: !done }),
      });

      if (!res.ok) throw new Error("failed to update");
      const updated: Todo = await res.json();

      setTodos((prev) =>
        prev.map((t) => (t.id === updated.id ? updated : t))
      );
    } catch (err) {
      console.error(err);
    }
  };

  // 삭제 (서버 DELETE)
  const removeTodo = async (id: string) => {
    try {
      const res = await fetch("/api/todos", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) throw new Error("failed to delete");
      const removed: Todo = await res.json();

      setTodos((prev) => prev.filter((t) => t.id !== removed.id));
    } catch (err) {
      console.error(err);
    }
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
          📝 간단 TODO 리스트 (서버 버전)
        </h1>

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
            disabled={loading}
            style={{
              padding: "8px 14px",
              borderRadius: "8px",
              border: "none",
              background: loading ? "#9ca3af" : "#2563eb",
              color: "white",
              fontSize: "0.9rem",
              fontWeight: 600,
              cursor: loading ? "default" : "pointer",
              whiteSpace: "nowrap",
            }}
          >
            {loading ? "저장 중..." : "추가"}
          </button>
        </form>

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
                  onChange={() => toggleTodo(todo.id, todo.done)}
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
