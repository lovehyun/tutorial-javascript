FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Install uglify
RUN npm install -g uglify-js

# Minify the main client-side js file
RUN uglifyjs game7.js -o game7.min.js

# Update HTML file
RUN sed -i 's/game7.js/game7.min.js/g' game.html

# Node JS
EXPOSE 3000
# WebSocket
EXPOSE 8080

CMD [ "node", "server7.js" ]
