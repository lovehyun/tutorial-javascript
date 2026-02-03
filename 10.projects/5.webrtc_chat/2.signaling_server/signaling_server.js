const WebSocket = require('ws');
const server = new WebSocket.Server({ port: 8080 });

const clients = [];

server.on('connection', socket => {
    clients.push(socket);
    socket.on('message', message => {
        // console.log('Received message:', message);

        const messageStr = message.toString('utf8');
        console.log('Received message:', messageStr);
        
        clients.forEach(client => {
            if (client !== socket && client.readyState === WebSocket.OPEN) {
                client.send(message);
                console.log('Sent message to client:', messageStr);
            }
        });
    });
    socket.on('close', () => {
        clients.splice(clients.indexOf(socket), 1);
    });
});
