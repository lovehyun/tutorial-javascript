# Node.js 환경에서 Express 앱 실행
FROM node:20

WORKDIR /app

# package.json과 package-lock.json 복사 및 의존성 설치
COPY package*.json ./
RUN npm install

# 소스 코드 복사
COPY . .

# 환경 변수 설정 (선택 사항)
ENV PORT=3000

# Express 앱 실행 포트 노출
EXPOSE 3000

# Express 서버 실행
CMD ["node", "app.js"]
