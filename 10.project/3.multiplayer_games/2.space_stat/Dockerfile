FROM node:18-alpine

WORKDIR /app

COPY . .

RUN npm install

# Grant execution permission to webpack
RUN chmod +x ./node_modules/.bin/webpack

# Build the JavaScript modules with webpack
RUN npm run build

# Update HTML file
# RUN sed -i 's/main.js/dist\/bundle.js/g' client/game.html

# Node JS & WebSocket
EXPOSE 3000
EXPOSE 8080

CMD [ "node", "server.js" ]
