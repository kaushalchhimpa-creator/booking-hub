const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db'); 

const app = express();

connectDB();

// ==========================================
// 🔥 HARDCORE SECURITY LOCK: Zero Bypass CORS
// ==========================================
const allowedOrigins = [
    'http://localhost:5173', 
    'https://booking-hub-frontend-7v7l.onrender.com'
];

app.use(cors({
    origin: function (origin, callback) {
        // Agar request local server se bina origin ke hai ya allowed list se hai, toh chalne do
        // Lekin agar production pe bina origin (like Hoppscotch Proxy) request aati hai, toh use block karo
        if (allowedOrigins.indexOf(origin) !== -1) {
            return callback(null, true);
        }
        
        // Agar tool (Postman/Hoppscotch) direct bina browser origin ke bhej raha hai, toh strict block!
        if (!origin) {
            return callback(new Error('CORS Not Allowed'), false);
        }
        
        return callback(new Error('CORS Not Allowed'), false);
    },
    credentials: true
}));

app.use(express.json());

// ==========================================
// 🛡️ BULLETPROOF MIDDLEWARE: Full Lockdown
// ==========================================
app.use((req, res, next) => {
    // Sirf root '/' path ko chhod kar baaki SABHI requests ke liye secret key check hogi
    // Login aur Register ko bhi website se hi aana padega x-api-secret lekar
    if (req.path === '/') {
        return next();
    }

    const frontendKey = req.headers['x-api-secret'];
    const systemSecret = process.env.BACKEND_API_SECRET || "MY_FALLBACK_SECRET_KEY";

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
    res.send('Booking Hub Backend Server Is Locked & Secured!');
});

// Global Error Handler
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