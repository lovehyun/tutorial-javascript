# 사용할 베이스 이미지
FROM node:18-slim

# 작업 디렉토리 설정
WORKDIR /usr/src/app

# 호스트의 현재 디렉토리의 package.json 및 package-lock.json을 작업 디렉토리에 복사
COPY package*.json ./

# 의존성 설치
RUN npm install

# 현재 디렉토리의 모든 파일을 작업 디렉토리로 복사
COPY . .

# 포트 설정
EXPOSE 3000

# 앱 실행
CMD ["node", "app.js"]
