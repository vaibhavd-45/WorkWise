const mongoose = require('mongoose');
const Seat = require('../models/Seat');

const initializeSeats = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        // Clear existing seats
        await Seat.deleteMany({});

        const seats = [];
        let seatNumber = 1;

        // Create 11 rows with 7 seats each
        for (let row = 1; row <= 11; row++) {
            for (let position = 1; position <= 7; position++) {
                seats.push({
                    seatNumber,
                    row,
                    position,
                    isBooked: false
                });
                seatNumber++;
            }
        }

        // Create last row with 3 seats
        for (let position = 1; position <= 3; position++) {
            seats.push({
                seatNumber,
                row: 12,
                position,
                isBooked: false
            });
            seatNumber++;
        }

        await Seat.insertMany(seats);
        console.log('Seats initialized successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error initializing seats:', error);
        process.exit(1);
    }
};

initializeSeats(); 