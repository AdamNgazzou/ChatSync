const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema(
  {
    name: { type: String, required: false }, // Optional for private chats
    type: { type: String, enum: ['private', 'group'], required: true }, // "private" or "group"
    image: { type: String, required: false },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Array of user IDs
  },
  { timestamps: true } // Automatically adds `createdAt` and `updatedAt` fields
);

module.exports = mongoose.model('Room', roomSchema);