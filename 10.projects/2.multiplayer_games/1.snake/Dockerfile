FROM node:18-slim

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

# exec 사용을 위해 쉘 모드로 CMD 작성
CMD ["sh", "-c", "exec npm start"]
