// app/api/todos/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

// GET /api/todos  : 전체 목록
export async function GET() {
  const todos = await prisma.todo.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(todos);
}

// POST /api/todos : 새 todo 추가 { text }
export async function POST(req: Request) {
  let body: unknown;

  try {
    body = await req.json();
  } catch {
    return new NextResponse("invalid json", { status: 400 });
  }

  const text = (body as { text?: string }).text?.trim();
  if (!text) {
    return new NextResponse("text is required", { status: 400 });
  }

  const todo = await prisma.todo.create({
    data: { text },
  });

  return NextResponse.json(todo, { status: 201 });
}

// PATCH /api/todos : 상태 변경 { id, done }
export async function PATCH(req: Request) {
  let body: unknown;

  try {
    body = await req.json();
  } catch {
    return new NextResponse("invalid json", { status: 400 });
  }

  const { id, done } = body as { id?: string; done?: boolean };

  if (!id || typeof done !== "boolean") {
    return new NextResponse("id and done are required", { status: 400 });
  }

  try {
    const todo = await prisma.todo.update({
      where: { id },
      data: { done },
    });

    return NextResponse.json(todo);
  } catch {
    return new NextResponse("not found", { status: 404 });
  }
}

// DELETE /api/todos : 삭제 { id }
export async function DELETE(req: Request) {
  let body: unknown;

  try {
    body = await req.json();
  } catch {
    return new NextResponse("invalid json", { status: 400 });
  }

  const { id } = body as { id?: string };

  if (!id) {
    return new NextResponse("id is required", { status: 400 });
  }

  try {
    const todo = await prisma.todo.delete({
      where: { id },
    });

    return NextResponse.json(todo);
  } catch {
    return new NextResponse("not found", { status: 404 });
  }
}
