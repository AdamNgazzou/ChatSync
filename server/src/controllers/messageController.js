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