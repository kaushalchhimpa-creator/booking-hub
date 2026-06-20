const Booking = require('../models/Booking');
const User = require('../models/User');

// ==========================================
// 1. GET PUBLIC PROVIDERS (🔒 FULLY FIXED FOR PRICE & EXP)
// ==========================================
exports.getPublicProviders = async (req, res) => {
  try {
    const { category, state, city } = req.query;
    if (!category) {
      return res.status(400).json({ success: false, message: "Category is required" });
    }

    let filter = {
      role: { $regex: new RegExp('^Provider$', 'i') },
      category: { $regex: new RegExp(`^${category}$`, 'i') }
    };

    if (state && city) {
      filter.state = { $regex: new RegExp(`^${state}$`, 'i') };
      filter.city = { $regex: new RegExp(`^${city}$`, 'i') };
    }

    const providers = await User.find(filter).select(
      'name email contactNumber averageRating successBookingsCount completedServices jobsDone state city pricePerHour experience'
    );

    return res.status(200).json({ 
      success: true, 
      data: providers 
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// 2. CREATE BOOKING
// ==========================================
exports.createBooking = async (req, res) => {
  try {
    const { category, bookingDate, expiryMinutes, visitingCharge } = req.body;
    const userId = req.user.id; 

    const bufferTime = new Date();
    bufferTime.setMinutes(bufferTime.getMinutes() - 30); 

    if (new Date(bookingDate) < bufferTime) {
      return res.status(400).json({ success: false, message: "❌ Error: Past date is not allowed!" });
    }

    const newBooking = new Booking({
      user: userId,
      category,
      bookingDate,
      expiryMinutes: Number(expiryMinutes),
      visitingCharge: visitingCharge ? Number(visitingCharge) : 100, 
      status: 'Pending'
    });

    await newBooking.save();
    return res.status(201).json({ success: true, data: newBooking });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// 3. GET MY BOOKINGS
// ==========================================
exports.getMyBookings = async (req, res) => {
  try {
    const userId = req.user.id;
    const currentUser = await User.findById(userId);
    if (!currentUser) return res.status(404).json({ success: false, message: "User not found" });

    let bookings = [];

    if (currentUser.role === 'Provider') {
      bookings = await Booking.find({
        $or: [
          { 
            category: currentUser.category,
            status: 'Pending'
          }, 
          { provider: userId },
          { user: userId }
        ]
      })
      .populate({
        path: 'user',
        select: 'name contactNumber role state city pricePerHour experience', // Added missing fields here too just in case
      })
      .populate('provider', 'name contactNumber state city pricePerHour experience') // Added here too
      .sort({ createdAt: -1 });

      bookings = bookings.filter(b => {
        if (b.status === 'Pending' && b.user) {
          return b.user.state === currentUser.state && b.user.city === currentUser.city;
        }
        return true;
      });

    } else {
      bookings = await Booking.find({ user: userId })
        .populate('user', 'name contactNumber role state city')
        .populate('provider', 'name contactNumber state city pricePerHour experience') // Added here too
        .sort({ createdAt: -1 });
    }

    return res.status(200).json({ success: true, data: bookings });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// 4. UPDATE BOOKING STATUS
// ==========================================
exports.updateBookingStatus = async (req, res) => {
  try {
    const { bookingId, status, providerEta } = req.body;
    const providerId = req.user.id;

    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });

    booking.status = status; 
    booking.provider = providerId;
    booking.providerEta = providerEta || '30 Mins';

    await booking.save();
    return res.status(200).json({ success: true, data: booking });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// 5. MARK SATISFIED
// ==========================================
exports.markSatisfied = async (req, res) => {
  try {
    const { bookingId } = req.body;
    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });

    booking.status = 'Satisfied';
    await booking.save();
    return res.status(200).json({ success: true, data: booking });
  } catch (error) { return res.status(500).json({ success: false, message: error.message }); }
};

// ==========================================
// 6. FINAL COMPLETE
// ==========================================
exports.finalComplete = async (req, res) => {
  try {
    const { bookingId } = req.body;
    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });

    booking.status = 'Completed';
    await booking.save();

    if (booking.provider) {
      await User.findByIdAndUpdate(booking.provider, { 
        $inc: { 
          successBookingsCount: 1,
          completedServices: 1,
          jobsDone: 1
        } 
      });
    }
    return res.status(200).json({ success: true, message: "💰 Service Completed and Provider Count Updated!", data: booking });
  } catch (error) { return res.status(500).json({ success: false, message: error.message }); }
};

// ==========================================
// 7. SUBMIT RATING
// ==========================================
exports.submitRating = async (req, res) => {
  try {
    const { bookingId, rating, review } = req.body;
    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });

    booking.rating = Number(rating);
    booking.review = review || "";
    await booking.save();

    if (booking.provider) {
      const allRatedBookings = await Booking.find({
        provider: booking.provider,
        status: 'Completed',
        rating: { $exists: true, $ne: null }
      });

      const totalRatings = allRatedBookings.length;
      const sumOfRatings = allRatedBookings.reduce((sum, b) => sum + b.rating, 0);
      const newAverage = totalRatings > 0 ? sumOfRatings / totalRatings : Number(rating);

      await User.findByIdAndUpdate(booking.provider, {
        $set: { averageRating: newAverage }
      });
    }

    return res.status(200).json({ success: true, message: "⭐ Rating submitted and provider profile updated successfully!", data: booking });
  } catch (error) { return res.status(500).json({ success: false, message: error.message }); }
};