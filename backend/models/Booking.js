const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    userName: { type: String, required: true },
    carModel: { type: String, required: true },
    carType: { type: String, enum: ['Hatchback', 'Sedan', 'SUV', 'Luxury'], required: true },
    serviceType: { type: String, required: true },
    price: { type: Number, required: true },
    pickupDate: { type: Date, required: true },
    phone: { type: String, required: true },
    feedback: {
        rating: { type: Number, min: 1, max: 5 },
        comment: { type: String }
    },
    cancelOtp: { type: String }, // Stores hashed or plain OTP temporarily
    cancelOtpExpires: { type: Date }, // Expiration time for OTP
    status: { type: String, enum: ['Pending', 'Confirmed', 'In Progress', 'Completed', 'Cancelled'], default: 'Pending' },
    paymentStatus: { type: String, enum: ['Pending', 'Paid', 'Failed'], default: 'Pending' },
    transactionId: { type: String },
    paymentDate: { type: Date },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Booking', bookingSchema);
