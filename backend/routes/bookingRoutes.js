const express = require('express');
const router = express.Router();


const { 
  createBooking, 
  getMyBookings, 
  updateBookingStatus, 
  markSatisfied, 
  finalComplete,
  getPublicProviders,
  submitRating,
  getAdminOverview
} = require('../controllers/bookingController');


const { protect, requireAdmin } = require('../config/authMiddleware');

router.get('/public-providers', getPublicProviders);

router.post('/book', protect, createBooking);

router.get('/my-bookings', protect, getMyBookings);

router.get('/admin/overview', protect, requireAdmin, getAdminOverview);

router.put('/status', protect, updateBookingStatus);

router.put('/satisfy', protect, markSatisfied);

router.put('/final-complete', protect, finalComplete);

router.put('/rate', protect, submitRating);

module.exports = router;
