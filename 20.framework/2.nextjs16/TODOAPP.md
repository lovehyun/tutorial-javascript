# Next.js Todo 앱 전체 과정: 프런트 단독 → API → Prisma + SQLite

## 1. Next.js 기본 생성

```bash
npx create-next-app@latest my-app
cd my-app
npm run dev
```

---

## 2. 프런트엔드 단독 Todo 버전

```tsx
"use client";

import { useState } from "react";

export default function Page() {
  const [text, setText] = useState("");
  const [todos, setTodos] = useState<string[]>([]);

  return (
    <div>
      <h1>Todo App</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!text.trim()) return;
          setTodos([text, ...todos]);
          setText("");
        }}
      >
        <input value={text} onChange={(e) => setText(e.target.value)} />
        <button>Add</button>
      </form>

      <ul>
        {todos.map((t, idx) => (
          <li key={idx}>{t}</li>
        ))}
      </ul>
    </div>
  );
}
```

---

## 3. Next.js API Routes 기반 Todo

### 3.1 `/api/todos`

```ts
import { NextResponse } from "next/server";

let todos: string[] = [];

export async function GET() {
  return NextResponse.json(todos);
}

export async function POST(req: Request) {
  const { text } = await req.json();
  todos.unshift(text);
  return NextResponse.json({ ok: true });
}
```

---

## 4. Prisma + SQLite 연동

### 4.1 설치

```bash
npm install prisma --save-dev
npm install @prisma/client
npx prisma init --datasource-provider sqlite
```

---

## 5. Prisma 7 대응 — schema.prisma

```prisma
generator client {
  provider = "prisma-client"
  output   = "../app/generated/prisma"
}

datasource db {
  provider = "sqlite"
}

model Todo {
  id        String   @id @default(cuid())
  text      String
  done      Boolean  @default(false)
  createdAt DateTime @default(now())
}
```

---

## 6. DB 생성 & generate

```bash
npx prisma migrate dev --name init_todo
npx prisma generate
```

---

## 7. Prisma 7 + SQLite는 adapter 필수

```bash
npm install @prisma/adapter-better-sqlite3 better-sqlite3
```

---

## 8. PrismaClient 생성 — lib/prisma.ts

```ts
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../app/generated/prisma/client";

const connectionString = process.env.DATABASE_URL ?? "file:./dev.db";

const adapter = new PrismaBetterSqlite3({
  url: connectionString,
});

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: ["error", "warn"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
```

---

## 9. DB 기반 API — app/api/todos/route.ts

```ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const todos = await prisma.todo.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(todos);
}

export async function POST(req: Request) {
  const { text } = await req.json();
  await prisma.todo.create({ data: { text } });
  return NextResponse.json({ ok: true });
}
```

---

## 10. 프런트 — DB 불러오기

```tsx
"use client";

import { useEffect, useState } from "react";

type Todo = {
  id: string;
  text: string;
  done: boolean;
  createdAt: string;
};

export default function Page() {
  const [text, setText] = useState("");
  const [todos, setTodos] = useState<Todo[]>([]);

  async function load() {
    const res = await fetch("/api/todos");
    const data = await res.json();
    setTodos(data);
  }

  useEffect(() => {
    load();
  }, []);

  async function addTodo() {
    await fetch("/api/todos", {
      method: "POST",
      body: JSON.stringify({ text }),
    });
    setText("");
    load();
  }

  return (
    <div>
      <h1>Todo (Prisma + SQLite)</h1>

      <input value={text} onChange={(e) => setText(e.target.value)} />
      <button onClick={addTodo}>Add</button>

      <ul>
        {todos.map((t) => (
          <li key={t.id}>{t.text}</li>
        ))}
      </ul>
    </div>
  );
}
```

---

## 11. 전체 흐름 요약

```
1) Create Next.js  
2) 프런트 단독 Todo  
3) API Routes  
4) Prisma init  
5) schema.prisma 구성  
6) migrate dev  
7) adapter 설치  
8) lib/prisma.ts 작성  
9) API → DB 연동  
10) 프런트 fetch 연동
```

---

## 12. 최종 결과

- Next.js 16 프론트
- Next.js API Routes
- Prisma 7 + SQLite
- CRUD Todo 앱 완성
