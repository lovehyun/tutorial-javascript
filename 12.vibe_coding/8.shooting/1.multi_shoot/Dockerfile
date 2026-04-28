FROM node:20-alpine AS base

# better-sqlite3 빌드용 (네이티브 모듈)
RUN apk add --no-cache python3 make g++

WORKDIR /app

COPY package.json ./
RUN npm install --omit=dev

COPY server.js ./
COPY server ./server
COPY public ./public

# DB 디렉토리
RUN mkdir -p /app/data

ENV PORT=3000
ENV DB_PATH=/app/data/multi-shoot.db

EXPOSE 3000

VOLUME ["/app/data"]

CMD ["node", "server.js"]
