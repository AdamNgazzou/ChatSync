// server/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const WebSocket = require('ws');
const routes = require('./src/routes/chatRoute');
const { handleWSConnection } = require('./src/controllers/wsController');
const { connectDB } = require('./src/config/db'); // Import the database connection function

// import routes
const authRoutes = require('./src/routes/authRoute');


const app = express();
const PORT = process.env.PORT || 3000;
const server = http.createServer(app);

// Allow requests from the frontend's origin
app.use(cors({
    origin: 'http://localhost:3000', // Replace with your frontend's URL
    credentials: true, // Allow cookies if needed
  }));
app.use(express.json()); // Middleware to parse JSON requests

app.use('/', routes);
app.use("/auth", authRoutes); // Mount authentication routes

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

// Connect to the database and start the server
(async () => {
    try {
        await connectDB(); // Wait for the database connection to be established
        server.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));
    } catch (err) {
        console.error("Failed to start the server:", err);
        process.exit(1); // Exit the process if the database connection fails
    }
})();