const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true }, // Reference to the room
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the sender
    content: { type: String, required: true }, // Message content
    type: { type: String, default: 'text' }, // e.g., "text", "image", "file"
  },
  { timestamps: true } // Automatically adds `createdAt` and `updatedAt` fields
);

module.exports = mongoose.model('Message', messageSchema);