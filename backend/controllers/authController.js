const nodemailer = require('nodemailer');
const crypto = require('crypto');
const User = require('../models/User'); 
const bcrypt = require('bcryptjs'); 
const jwt = require('jsonwebtoken'); 

const otpStore = {};

// ==========================================
// 1. REGISTER CONTROLLER (🔒 FULLY COMPLETE & FIXED)
// ==========================================
exports.register = async (req, res) => {
    try {
        const { name, email, password, role, city, state, category, pricePerHour, experience, contactNumber } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'User already exists' });

        // String values ko safely proper numbers mein parse kar rahe hain taaki zero na ho data
        const parsedPrice = pricePerHour ? Number(pricePerHour) : 0;
        const parsedExperience = experience ? Number(experience) : 0;

        const user = await User.create({ 
            name, 
            email, 
            password, 
            role: role || 'User', 
            city: city || 'Not Specified', 
            state: state || 'Not Specified', 
            category: category || '',
            pricePerHour: role === 'Provider' ? parsedPrice : 0,
            experience: role === 'Provider' ? parsedExperience : 0,
            contactNumber: contactNumber || ''
        });

        return res.status(201).json({ success: true, user });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// ==========================================
// 2. LOGIN CONTROLLER (🔒 FULLY COMPLETE)
// ==========================================
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: 'Invalid Credentials!' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Invalid Credentials!' });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1d' }
        );

        return res.status(200).json({ 
            success: true, 
            token, 
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                city: user.city,
                state: user.state,
                category: user.category,
                pricePerHour: user.pricePerHour,
                experience: user.experience,
                contactNumber: user.contactNumber
            } 
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// ==========================================
// 3. FORGOT PASSWORD CONTROLLER (🔒 FULLY COMPLETE)
// ==========================================
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found with this email!" });
        }

        const otp = Math.floor(1000 + Math.random() * 9000).toString();
        
        otpStore[email] = {
            otp: otp,
            expiresAt: Date.now() + 5 * 60 * 1000 
        };

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: `🔒 ${otp} is your Booking Hub reset code`, 
            text: `Hi there,

You requested to reset your password on Booking Hub.

Verification Code: ${otp}

This code will expire in 5 minutes. If you didn't request this, you can safely ignore this email.

Thanks,
Team Booking Hub ⚡`
        };

        await transporter.sendMail(mailOptions);
        return res.status(200).json({ success: true, message: "OTP sent successfully!" });

    } catch (error) {
        console.error("Email Error:", error);
        return res.status(500).json({ success: false, message: "Internal server error in sending email." });
    }
};

// ==========================================
// 4. RESET PASSWORD CONTROLLER (🔒 FULLY COMPLETE)
// ==========================================
exports.resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;

        const record = otpStore[email];
        if (!record) {
            return res.status(400).json({ success: false, message: "OTP expired or not requested!" });
        }

        if (Date.now() > record.expiresAt) {
            delete otpStore[email];
            return res.status(400).json({ success: false, message: "OTP has expired!" });
        }

        if (record.otp !== otp) {
            return res.status(400).json({ success: false, message: "Invalid OTP code!" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found!" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        await User.updateOne(
            { email: email },
            { $set: { password: hashedPassword } }
        );

        delete otpStore[email];

        return res.status(200).json({ success: true, message: "Password reset successfully!" });

    } catch (error) {
        console.error("Reset Error:", error);
        return res.status(500).json({ success: false, message: "Failed to reset password." });
    }
};