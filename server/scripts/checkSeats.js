const mongoose = require('mongoose');
const Seat = require('../models/Seat');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/train-booking', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Function to check seats
const checkSeats = async () => {
    try {
        const seats = await Seat.find().sort('seatNumber');
        console.log(`Total seats in database: ${seats.length}`);
        console.log('First few seats:', seats.slice(0, 5));
        console.log('Last few seats:', seats.slice(-5));
        
        const availableSeats = seats.filter(seat => !seat.isBooked).length;
        console.log(`Available seats: ${availableSeats}`);
        
        // Check if seats have all required fields
        const invalidSeats = seats.filter(seat => 
            !seat.seatNumber || 
            !seat.row || 
            !seat.position || 
            typeof seat.isBooked !== 'boolean'
        );
        
        if (invalidSeats.length > 0) {
            console.log('Invalid seats found:', invalidSeats);
        } else {
            console.log('All seats have valid data');
        }
        
        await mongoose.connection.close();
        console.log('Database connection closed');
    } catch (error) {
        console.error('Error checking seats:', error);
        process.exit(1);
    }
};

// Run the check
checkSeats(); 