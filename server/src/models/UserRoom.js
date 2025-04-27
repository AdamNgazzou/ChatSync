const mongoose = require('mongoose');

const userRoomSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
        unread: { type: Number, default: 0 }, // Tracks unread messages for this user in the room
    },
    { timestamps: true } // Automatically adds `createdAt` and `updatedAt` fields
);

module.exports = mongoose.model('UserRoom', userRoomSchema);
