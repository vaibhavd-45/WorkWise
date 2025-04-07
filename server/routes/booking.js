const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Seat = require('../models/Seat');
const Booking = require('../models/Booking');

// Middleware to verify JWT token
const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ message: 'Please authenticate' });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        req.userId = decoded.id;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Please authenticate' });
    }
};

// Get all seats
router.get('/seats', async (req, res) => {
    try {
        const seats = await Seat.find().sort('seatNumber');
        res.json(seats);
    } catch (error) {
        console.error('Error fetching seats:', error);
        res.status(500).json({ message: 'Error fetching seats' });
    }
});

// Get user's bookings
router.get('/user', auth, async (req, res) => {
    try {
        const bookings = await Booking.find({ 
            user: req.userId,
            isActive: true 
        }).populate('seats');
        res.json(bookings);
    } catch (error) {
        console.error('Error fetching user bookings:', error);
        res.status(500).json({ message: 'Error fetching bookings' });
    }
});

// Book seats
router.post('/book', auth, async (req, res) => {
    try {
        const { numberOfSeats } = req.body;
        
        // Validate input
        if (!numberOfSeats || typeof numberOfSeats !== 'number' || numberOfSeats < 1 || numberOfSeats > 7) {
            return res.status(400).json({ message: 'Please enter a valid number of seats (1-7)' });
        }

        // Find available seats
        const availableSeats = await Seat.find({ isBooked: false }).sort('row seatNumber');
        
        if (availableSeats.length < numberOfSeats) {
            return res.status(400).json({ message: `Only ${availableSeats.length} seats are available` });
        }

        // Group seats by row
        const seatsByRow = {};
        availableSeats.forEach(seat => {
            if (!seatsByRow[seat.row]) {
                seatsByRow[seat.row] = [];
            }
            seatsByRow[seat.row].push(seat);
        });

        // Find a row with enough consecutive seats
        let selectedSeats = [];
        for (const row in seatsByRow) {
            if (seatsByRow[row].length >= numberOfSeats) {
                selectedSeats = seatsByRow[row].slice(0, numberOfSeats);
                break;
            }
        }

        // If no row has enough consecutive seats, take the first available seats
        if (selectedSeats.length === 0) {
            selectedSeats = availableSeats.slice(0, numberOfSeats);
        }

        // Create booking
        const booking = new Booking({
            user: req.userId,
            seats: selectedSeats.map(seat => seat._id)
        });

        // Update seats
        await Seat.updateMany(
            { _id: { $in: selectedSeats.map(seat => seat._id) } },
            { isBooked: true, bookedBy: req.userId }
        );

        await booking.save();

        // Fetch updated seats
        const updatedSeats = await Seat.find().sort('seatNumber');
        res.json({ message: 'Seats booked successfully', seats: updatedSeats });
    } catch (error) {
        console.error('Error booking seats:', error);
        res.status(500).json({ message: 'Error booking seats' });
    }
});

// Cancel booking
router.post('/cancel/:id', auth, async (req, res) => {
    try {
        const booking = await Booking.findOne({
            _id: req.params.id,
            user: req.userId,
            isActive: true
        });

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Update seats
        await Seat.updateMany(
            { _id: { $in: booking.seats } },
            { isBooked: false, bookedBy: null }
        );

        // Update booking
        booking.isActive = false;
        await booking.save();

        res.json({ message: 'Booking cancelled successfully' });
    } catch (error) {
        console.error('Error cancelling booking:', error);
        res.status(500).json({ message: 'Error cancelling booking' });
    }
});

module.exports = router; 