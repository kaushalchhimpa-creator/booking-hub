const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); 

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['Customer', 'Provider'], default: 'Customer' },
    category: { type: String, default: '' }, 
    pricePerHour: { type: Number, default: 0 },
    experience: { type: Number, default: 0 },
    contactNumber: { type: String, default: '' },
    successBookingsCount: { type: Number, default: 0 }, 
    state: { type: String, required: true },
    city: { type: String, required: true }
}, { timestamps: true });


userSchema.pre('save', async function () {
    
    if (!this.isModified('password')) return;
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    } catch (error) {
        throw error; 
    }
});

module.exports = mongoose.model('User', userSchema);