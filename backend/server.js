const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db'); 

const app = express();

connectDB();

// =======================================================
// 🚫 ULTRA SECURITY: Postman & Hoppscotch Immediate Ban
// =======================================================
app.use((req, res, next) => {
    // Sabhi paths ke liye check chalega, sirf '/' (root path) ko chhod kar
    if (req.path === '/') {
        return next();
    }

    const userAgent = req.headers['user-agent'] || '';

    // Agar request Postman, Hoppscotch, Insomnia jise tools se aa rahi hai, toh direct 403 block!
    if (
        userAgent.includes('Postman') || 
        userAgent.includes('Hoppscotch') || 
        userAgent.includes('Insomnia') ||
        userAgent.includes('PostmanRuntime') ||
        userAgent === '' // Agar koi tool apna user-agent chupa raha hai
    ) {
        return res.status(403).json({ 
            success: false, 
            message: "Access Denied! Requests from Postman or Hoppscotch are strictly banned." 
        });
    }
    next();
});

// Normal CORS settings tumhari live frontend website ke liye
app.use(cors({
    origin: ['http://localhost:5173', 'https://booking-hub-frontend-7v7l.onrender.com'],
    credentials: true
}));

app.use(express.json());

// Routes Links
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/providers', require('./routes/providerRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));

// Test Route
app.get('/', (req, res) => {
    res.send('Booking Hub Backend Server Is Locked & Secured!');
});

// Simple Error Handler
app.use((err, req, res, next) => {
    res.status(500).json({ success: false, message: "Something went wrong on server!" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});