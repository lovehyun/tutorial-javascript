FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Install minify
RUN npm install -g minify

# Minify the main client-side js file
RUN minify game7.js -o game7.min.js

# Update HTML file
RUN sed -i 's/game7.js/game7.min.js/g' index.html

# Node JS
EXPOSE 3000
# WebSocket
EXPOSE 8080

CMD [ "node", "server7.js" ]
