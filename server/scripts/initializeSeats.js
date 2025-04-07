require('dotenv').config();
const mongoose = require('mongoose');
const Seat = require('../models/Seat');

async function initializeSeats() {
    try {
        console.log('Connecting to MongoDB...');
        console.log('MongoDB URI:', process.env.MONGODB_URI ? 'URI is set' : 'URI is missing');
        
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        
        console.log('Connected to MongoDB');

        // Clear existing seats
        console.log('Clearing existing seats...');
        await Seat.deleteMany({});
        console.log('Existing seats cleared');
        
        // Create seats array
        const seats = [];
        let seatNumber = 1;
        
        // Create seats for rows 1-11 (7 seats each)
        for (let row = 1; row <= 11; row++) {
            for (let position = 1; position <= 7; position++) {
                seats.push({
                    seatNumber: seatNumber++,
                    row,
                    position,
                    isBooked: false,
                    bookedBy: null
                });
            }
        }
        
        // Create seats for row 12 (3 seats)
        for (let position = 1; position <= 3; position++) {
            seats.push({
                seatNumber: seatNumber++,
                row: 12,
                position,
                isBooked: false,
                bookedBy: null
            });
        }
        
        // Insert seats into database
        console.log('Creating new seats...');
        await Seat.insertMany(seats);
        console.log(`Successfully created ${seats.length} seats`);
        
        // Verify seats were created
        const totalSeats = await Seat.countDocuments();
        console.log(`Total seats in database: ${totalSeats}`);
        
        // Show some sample seats
        const firstSeats = await Seat.find().sort({ seatNumber: 1 }).limit(5);
        const lastSeats = await Seat.find().sort({ seatNumber: -1 }).limit(4);
        
        console.log('First few seats:', firstSeats);
        console.log('Last few seats:', lastSeats);
        
        const availableSeats = await Seat.countDocuments({ isBooked: false });
        console.log(`Available seats: ${availableSeats}`);
        
    } catch (error) {
        console.error('Error initializing seats:', error);
    } finally {
        await mongoose.connection.close();
        console.log('Database connection closed');
        process.exit(0);
    }
}

// Run the initialization once
initializeSeats(); 