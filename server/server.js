// server/server.js
require('dotenv').config();
const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const routes = require('./src/routes/chatRoute');
const { handleWSConnection } = require('./src/controllers/wsController');

const app = express();
const PORT = process.env.PORT || 3000;
const server = http.createServer(app);

app.use('/', routes);

const wss = new WebSocket.Server({ noServer: true });

server.on('upgrade', (request, socket, head) => {
    if (request.url === '/chat') {
        wss.handleUpgrade(request, socket, head, (ws) => {
            handleWSConnection(wss, ws);
        });
    } else {
        socket.destroy();
    }
});

server.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));