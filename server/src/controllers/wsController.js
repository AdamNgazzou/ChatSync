const rooms = {} // { roomId: Set of ws clients }

function handleWSConnection(wss, ws) {
    ws.on('message', (data) => {
        let msg;
        try {
            msg = JSON.parse(data);
        } catch {
            return;
        }
        console.log("before", rooms)
        if (msg.type === 'join') {
            ws.roomId = msg.roomId;
            if (!rooms[msg.roomId]) rooms[msg.roomId] = new Set();
            rooms[msg.roomId].add(ws);

        } else if (msg.type === 'message' && ws.roomId) {
            // Broadcast only to users in the same room
            rooms[ws.roomId]?.forEach(client => {
                if (client !== ws && client.readyState === ws.OPEN) {
                    client.send(JSON.stringify({ content: msg.content, sender: msg.sender }));
                }
            });
        }
        console.log("after", rooms)


    });

    ws.on('close', () => {
        if (ws.roomId && rooms[ws.roomId]) {
            // Remove the WebSocket client from the room
            rooms[ws.roomId].delete(ws);
            console.log(`Client disconnected from room: ${ws.roomId}`);

            // If the room is empty, delete it
            if (rooms[ws.roomId].size === 0) {
                delete rooms[ws.roomId];
                console.log(`Room ${ws.roomId} deleted as it is now empty.`);
            }
        } else {
            console.warn(`Client disconnected but was not in any room.`);
        }
    });
}

module.exports = { handleWSConnection };