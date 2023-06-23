FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Install uglify
RUN npm install -g uglify-js

# Minify the main client-side js file
RUN uglifyjs client/stage1.js -o client/stage1.min.js

# Update HTML file
RUN sed -i 's/stage1.js/stage1.min.js/g' client/game.html

# Node JS
EXPOSE 3000
# WebSocket
EXPOSE 8080

CMD [ "node", "server.js" ]
