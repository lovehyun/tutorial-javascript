FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Node JS
EXPOSE 3000
# WebSocket
EXPOSE 8080

CMD [ "node", "server7.js" ]
