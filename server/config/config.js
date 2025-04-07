require('dotenv').config();

module.exports = {
    port: process.env.PORT || 5000,
    mongoURI: process.env.MONGODB_URI || 'mongodb://localhost:27017/train-booking',
    jwtSecret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-2024',
    nodeEnv: process.env.NODE_ENV || 'development'
}; 