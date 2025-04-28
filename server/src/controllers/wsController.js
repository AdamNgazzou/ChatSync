const { saveMessage } = require('./messageController');
const rooms = {} // { roomId: Set of ws clients }

function handleWSConnection(wss, ws) {
    ws.on('message', async (data) => {
        let msg;
        try {
            msg = JSON.parse(data);
        } catch {
            return;
        }

        if (msg.type === 'join') {
            ws.roomId = msg.roomId;
            if (!rooms[msg.roomId]) rooms[msg.roomId] = new Set();
            rooms[msg.roomId].add(ws);
        } else if (msg.type === 'message' && ws.roomId) {
            try {
                // Save the message to database
                const messageData = {
                    roomId: msg.roomId,
                    senderId: msg.sender,
                    content: msg.content
                };

                const savedMessage = await saveMessage(messageData);

                // Broadcast to other clients in the room
                rooms[ws.roomId]?.forEach(client => {
                    if (client !== ws && client.readyState === ws.OPEN) {
                        client.send(JSON.stringify({
                            content: msg.content,
                            sender: msg.sender,
                            messageId: savedMessage._id,
                            timestamp: savedMessage.createdAt
                        }));
                    }
                });
            } catch (error) {
                console.error('Error handling message:', error);
                ws.send(JSON.stringify({
                    type: 'error',
                    message: 'Failed to save message'
                }));
            }
        }
    });

    ws.on('close', () => {
        if (ws.roomId && rooms[ws.roomId]) {
            rooms[ws.roomId].delete(ws);
            if (rooms[ws.roomId].size === 0) {
                delete rooms[ws.roomId];
            }
        }
    });
}

module.exports = { handleWSConnection };