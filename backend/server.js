const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db'); 

const app = express();

connectDB();

// ==========================================
// 🔥 SECURITY LOCK: Tight CORS (Standard Method)
// ==========================================
const allowedOrigins = [
    'http://localhost:5173', 
    'https://booking-hub-frontend-7v7l.onrender.com'
];

app.use(cors({
    origin: function (origin, callback) {
        // Agar request browser se hai aur allowedOrigins mein hai, ya fir request local hai
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            return callback(null, true);
        }
        // Agar outside browser/tool se hai, toh standard tarike se CORS deny karo (Server crash nahi hoga)
        return callback(new Error('CORS Not Allowed'), false);
    },
    credentials: true
}));

app.use(express.json());

// ==========================================
// 🛡️ BULLETPROOF MIDDLEWARE: Safe Custom Response
// ==========================================
app.use((req, res, next) => {
    // 1. In tinon routes ko middleware check se bahar rakho
    if (req.path === '/' || req.path === '/api/auth/login' || req.path === '/api/auth/register') {
        return next();
    }

    // 2. Baaki endpoints ke liye check karo
    const frontendKey = req.headers['x-api-secret'];
    const systemSecret = process.env.BACKEND_API_SECRET || "MY_FALLBACK_SECRET_KEY"; // Agar env variable na mile toh crash nahi hoga

    if (!frontendKey || frontendKey !== systemSecret) {
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
    res.send('Booking Hub Backend Server Chal Raha Hai!');
});

// Global Error Handler (Taaki 500 Internal Server Error na aaye)
app.use((err, req, res, next) => {
    if (err.message === 'CORS Not Allowed') {
        return res.status(403).json({
            success: false,
            message: "Access Denied! Requests from this origin or tool are strictly blocked."
        });
    }
    res.status(500).json({ success: false, message: "Something went wrong on server!" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});