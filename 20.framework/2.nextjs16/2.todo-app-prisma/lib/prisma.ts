// lib/prisma.ts

import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../app/generated/prisma/client";

// Next.js가 .env 를 자동으로 읽어주니 dotenv/config 는 굳이 안 써도 됩니다.
const connectionString = process.env.DATABASE_URL ?? "file:./dev.db";

// 🔥 Prisma 7 "client" 엔진에서는 반드시 adapter 를 만들어서 넣어야 함
const adapter = new PrismaBetterSqlite3({
  url: connectionString,
});

// dev 환경에서 hot-reload 시 PrismaClient 중복 생성 방지용
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
