const mongoose = require("mongoose");

const Room = require("../models/Room");
const User = require("../models/User");
const UserRoom = require("../models/UserRoom"); // Import the UserRoom model

// Controller to create a new room
exports.createRoom = async (req, res) => {
    try {
        const { name, type, members, image } = req.body;

        // Validate required fields
        if (!type || !members || members.length < 2 || !image) {
            return res.status(400).json({
                error: "Invalid data: 'type' is required, and 'members' must include at least 2 users.",
            });
        }

        // Validate that all members are valid ObjectId
        const areValidObjectIds = members.every((member) => mongoose.Types.ObjectId.isValid(member));
        if (!areValidObjectIds) {
            return res.status(400).json({
                error: "Invalid data: One or more member IDs are not valid ObjectId.",
            });
        }

        // Check if all members exist in the database
        const existingUsers = await User.find({ _id: { $in: members } });
        if (existingUsers.length !== members.length) {
            return res.status(400).json({
                error: "One or more members do not exist.",
            });
        }

        // Create a new room
        const newRoom = new Room({
            name: name || null, // Optional for private chats
            type,
            members,
            image,
        });

        // Save the room to the database
        const savedRoom = await newRoom.save();

        // Create UserRoom entries for each member with unread count initialized to 0
        const userRoomEntries = members.map((member) => ({
            userId: member,
            roomId: savedRoom._id,
            unread: 0,
        }));
        await UserRoom.insertMany(userRoomEntries);

        // Respond with the created room
        res.status(201).json({
            message: "Room created successfully",
            room: savedRoom,
        });
    } catch (error) {
        console.error("Error creating room:", error);
        res.status(500).json({
            error: "An error occurred while creating the room",
        });
    }
};

// Controller to get rooms by member ID
exports.getRoomsByMemberId = async (req, res) => {
    try {
        const { memberId } = req.params;

        // Validate that the memberId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(memberId)) {
            return res.status(400).json({
                error: "Invalid member ID",
            });
        }

        // Find UserRoom entries for the given memberId
        const userRooms = await UserRoom.find({ userId: memberId }).populate("roomId", "name type image");

        // Map the results to include room details and unread counts
        const rooms = userRooms.map((userRoom) => ({
            room: userRoom.roomId,
            unread: userRoom.unread,
        }));

        // Respond with the rooms
        res.status(200).json({
            message: "Rooms retrieved successfully",
            rooms,
        });
    } catch (error) {
        console.error("Error retrieving rooms:", error);
        res.status(500).json({
            error: "An error occurred while retrieving the rooms",
        });
    }
};