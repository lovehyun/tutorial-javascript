// app/api/todos/route.ts
import { NextResponse } from "next/server";

type Todo = {
  id: string;
  text: string;
  done: boolean;
};

// ⚠ 아주 단순한 인메모리 저장소 (서버 재시작 시 초기화됨)
const todos: Todo[] = [];

export async function GET() {
  return NextResponse.json(todos);
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null) as { text?: string } | null;
  const text = body?.text?.trim();

  if (!text) {
    return new NextResponse("text is required", { status: 400 });
  }

  const todo: Todo = {
    id: crypto.randomUUID(),
    text,
    done: false,
  };

  todos.unshift(todo);
  return NextResponse.json(todo, { status: 201 });
}

export async function PATCH(req: Request) {
  const body = (await req.json().catch(() => null)) as
    | { id?: string; done?: boolean }
    | null;

  if (!body?.id || typeof body.done !== "boolean") {
    return new NextResponse("id and done are required", { status: 400 });
  }

  const todo = todos.find((t) => t.id === body.id);
  if (!todo) {
    return new NextResponse("not found", { status: 404 });
  }

  todo.done = body.done;
  return NextResponse.json(todo);
}

export async function DELETE(req: Request) {
  const body = (await req.json().catch(() => null)) as { id?: string } | null;

  if (!body?.id) {
    return new NextResponse("id is required", { status: 400 });
  }

  const index = todos.findIndex((t) => t.id === body.id);
  if (index === -1) {
    return new NextResponse("not found", { status: 404 });
  }

  const [removed] = todos.splice(index, 1);
  return NextResponse.json(removed);
}
