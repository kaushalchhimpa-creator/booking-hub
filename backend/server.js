const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db'); 

const app = express();

connectDB();

// =======================================================
// 🚫 TARGETED BLOCK: Banning Hoppscotch & Postman Completely
// =======================================================
app.use((req, res, next) => {
    if (req.path === '/') {
        return next();
    }

    const origin = req.headers.origin;
    const referer = req.headers.referer || '';


    const allowedOrigin = 'https://booking-hub-frontend-7v7l.onrender.com';
    const localOrigin = 'http://localhost:5173';

    
    if (!origin || (origin !== allowedOrigin && origin !== localOrigin)) {
        if (!referer.includes(allowedOrigin) && !referer.includes(localOrigin)) {
            return res.status(403).json({ 
                success: false, 
                message: "Access Denied! Direct API requests from tools like Postman or Hoppscotch are strictly blocked." 
            });
        }
    }

    next();
});

app.use(cors({
    origin: ['http://localhost:5173', 'https://booking-hub-frontend-7v7l.onrender.com'],
    credentials: true
}));

app.use(express.json());

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/providers', require('./routes/providerRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));

app.get('/', (req, res) => {
    res.send('Booking Hub Backend Server Is Locked & Secured!');
});


app.use((err, req, res, next) => {
    res.status(500).json({ success: false, message: "Something went wrong on server!" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});