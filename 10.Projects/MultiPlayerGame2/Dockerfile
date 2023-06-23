FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Install uglify
RUN npm install -g uglify-js

# Minify the main client-side js file
RUN uglifyjs game8.js -o game8.min.js

# Update HTML file
RUN sed -i 's/game8.js/game8.min.js/g' game.html

# Node JS
EXPOSE 3000
# WebSocket
EXPOSE 8080

CMD [ "node", "server8.js" ]
