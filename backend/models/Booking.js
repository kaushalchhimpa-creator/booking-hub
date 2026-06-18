const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: { 
    type: String, 
    required: true,
    enum: ['Electrician', 'Mechanic', 'Plumber', 'Doctor', 'Driver', 'Furniture', 'AC Repair'] // 🛠️ Total 7 Roles absolute clear
  },
  bookingDate: { type: Date, required: true },
  expiryMinutes: { type: Number, default: 30 },
  status: { 
    type: String, 
    enum: ['Pending', 'Accepted', 'Satisfied', 'Completed'], 
    default: 'Pending' 
  },
  provider: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  providerEta: { type: String },
  
  
  visitingCharge: { type: Number, default: 100 }, 

  
  rating: { type: Number, min: 1, max: 5 },
  review: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);