# Node.js slim 이미지 사용
FROM node:20-slim

# 작업 디렉터리
WORKDIR /app

# 패키지 정보 복사 (이미 있다면)
COPY package*.json ./ 

# 의존성 설치 (express 등)
RUN npm install --omit=dev

# 나머지 소스 복사
COPY . .

# 앱이 사용하는 포트
EXPOSE 3000

# 기본 엔트리포인트는 node
ENTRYPOINT ["node"]

# 기본은 취약 서버(weak) + 120초 플레이, 60초 결과
CMD ["server_weak.js", "120", "60"]

# docker build -t hangman-game .
# docker run --rm -p 3000:3000 hangman-game
# docker run --rm -p 3000:3000 hangman-game server_strong.js 120 60
# docker run -it --entrypoint /bin/bash hangman-game
