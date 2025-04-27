FROM node:20-bullseye-slim

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# database.db를 init_database.sql로 초기화
RUN apt-get update && apt-get install -y sqlite3 && rm -rf /var/lib/apt/lists/*
RUN sqlite3 database.db < init_database.sql

# 샘플 데이터 삽입 스크립트 실행
# RUN node insert_sample_db.js

EXPOSE 3000

CMD ["node", "app.js"]
