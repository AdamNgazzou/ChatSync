const Message = require('../models/Message');
const UserRoom = require('../models/UserRoom');
const mongoose = require('mongoose');

exports.saveMessage = async (messageData) => {
    try {
        // Validate and convert IDs to ObjectId
        if (!mongoose.Types.ObjectId.isValid(messageData.roomId)) {
            throw new Error("Invalid roomId format");
        }
        if (!mongoose.Types.ObjectId.isValid(messageData.senderId)) {
            throw new Error("Invalid senderId format");
        }

        const message = new Message({
            roomId: new mongoose.Types.ObjectId(messageData.roomId),
            senderId: new mongoose.Types.ObjectId(messageData.senderId),
            content: messageData.content,
            type: 'text'
        });

        const savedMessage = await message.save();
        console.log("Message saved successfully!");

        // Update unread count for all users in the room except the sender
        await UserRoom.updateMany(
            {
                roomId: messageData.roomId,
                userId: { $ne: messageData.senderId }
            },
            { $inc: { unread: 1 } }
        );

        return savedMessage;
    } catch (error) {
        console.error('Error saving message:', error);
        throw error;
    }
};
exports.getMessages = async (req, res) => {
    try {
        const roomId = req.params.roomId;
        const limit = parseInt(req.query.limit) || 20;
        const before = parseInt(req.query.before) || Date.now();
        console.log(before)
        if (!mongoose.Types.ObjectId.isValid(roomId)) {
            return res.status(400).json({ error: "Invalid roomId format" });
        }

        const messages = await Message.find({
            roomId: new mongoose.Types.ObjectId(roomId),
            createdAt: { $lt: new Date(before) }
        })
            .sort({ createdAt: -1 })
            .limit(limit)
            .populate('senderId', 'username');

        // Get the timestamp of the oldest message for next pagination
        const hasMore = messages.length === limit;
        const nextCursor = hasMore ? messages[messages.length - 1].createdAt.getTime() : null;

        return res.status(200).json({
            messages,
            pagination: {
                hasMore,
                nextCursor,
                limit
            }
        });
    } catch (error) {
        console.error('Error fetching messages:', error);
        return res.status(500).json({ error: 'Failed to fetch messages' });
    }
};