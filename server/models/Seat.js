const mongoose = require('mongoose');

const SeatSchema = new mongoose.Schema({
    seatNumber: {
        type: Number,
        required: true,
        unique: true,
        index: true
    },
    row: {
        type: Number,
        required: true
    },
    position: {
        type: Number,
        required: true
    },
    isBooked: {
        type: Boolean,
        default: false
    },
    bookedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    }
});

// Create compound index for row and position
SeatSchema.index({ row: 1, position: 1 }, { unique: true });

module.exports = mongoose.model('Seat', SeatSchema); 