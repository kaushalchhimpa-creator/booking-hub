const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db'); 

const app = express();

connectDB();

// ==========================================
// 🔥 SECURITY LOCK: Tight CORS & Origin Control
// ==========================================
const allowedOrigins = [
    'http://localhost:5173', 
    'https://booking-hub-frontend-7v7l.onrender.com'
];

app.use(cors({
    origin: function (origin, callback) {
        // Agar request browser se aa rahi hai aur allowed list mein hai, toh allow karo
        if (allowedOrigins.indexOf(origin) !== -1) {
            return callback(null, true);
        }
        
        // Agar bina origin ki requests hain (jaise Postman/Hoppscotch Proxy), toh unhe direct block karo!
        if (!origin) {
            return callback(new Error('❌ Direct tool requests are blocked by CORS!'), false);
        }
        
        return callback(new Error('❌ Not allowed by CORS from this origin!'), false);
    },
    credentials: true
}));

app.use(express.json());

// ==========================================
// 🛡️ BULLETPROOF MIDDLEWARE: Activated for Solid Security
// ==========================================
app.use((req, res, next) => {
    // 1. Agar koi normal link check kare '/' par, toh allow karo
    if (req.path === '/' || req.path === '/api/auth/login' || req.path === '/api/auth/register') {
        return next();
    }

    // 2. Baaki sabhi endpoints (bookings, providers) ke liye header check karo
    const frontendKey = req.headers['x-api-secret'];

    if (!frontendKey || frontendKey !== process.env.BACKEND_API_SECRET) {
        return res.status(403).json({ 
            success: false, 
            message: "Access Denied! Direct API requests are strictly blocked." 
        });
    }
    next();
});

// Routes Links
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/providers', require('./routes/providerRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));

// Test Route
app.get('/', (req, res) => {
    res.send('Booking Hub Backend Server Chal Raha Hai aur Ekdum Safe Hai!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});