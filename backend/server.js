const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db'); 

const app = express();

connectDB();

// ==========================================
// 🔥 SECURITY LOCK: Tight CORS & Origin Control
// ==========================================
const allowedOrigins = ['http://localhost:5173'];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) === -1) {
            return callback(new Error('Not allowed by CORS from this origin!'), false);
        }
        return callback(null, true);
    },
    credentials: true
}));

app.use(express.json());

// ==========================================
// 🛡️ BULLETPROOF MIDDLEWARE: Postman/Hoppscotch Blocker
// ==========================================
app.use((req, res, next) => {
    // Test route '/' ko bypass karo taaki browser pe server check ho sake
    if (req.path === '/') return next();

    const frontendKey = req.headers['x-api-secret'];

    if (!frontendKey || frontendKey !== process.env.BACKEND_API_SECRET) {
        return res.status(403).json({ 
            success: false, 
            message: "Access Denied! Direct API requests from Postman, Hoppscotch, or external scripts are strictly blocked." 
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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});