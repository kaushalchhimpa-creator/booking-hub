const mongoose = require('mongoose');

const providerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add provider name']
    },
    category: {
        type: String,
        required: [true, 'Please specify a category'],
        enum: ['Electrician', 'Plumber', 'Painter', 'Cleaner', 'Mechanic'] // Humne categories fix kar di hain
    },
    experience: {
        type: Number,
        required: [true, 'Please add experience in years']
    },
    pricePerHour: {
        type: Number,
        required: [true, 'Please add price per hour']
    },
    contactNumber: {
        type: String,
        required: [true, 'Please add a contact number']
    },
    availability: {
        type: Boolean,
        default: true 
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Provider', providerSchema);  

