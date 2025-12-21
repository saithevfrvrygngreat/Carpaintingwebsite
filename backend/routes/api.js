const fs = require('fs');
const express = require('express');
const router = express.Router();
const ServicePrice = require('../models/ServicePrice');
const Booking = require('../models/Booking');
const auth = require('../middleware/auth');
const nodemailer = require('nodemailer');
const Contact = require('../models/Contact'); // Import Contact Model globally

// Test connection
router.get('/ping', (req, res) => res.send('pong'));

// Get all service prices or filter by car type
router.get('/prices', async (req, res) => {
    try {
        const { carType } = req.query;
        let query = {};
        if (carType) query.carType = carType;
        const prices = await ServicePrice.find(query);
        res.json(prices);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Admin: Add/Update Price
router.post('/prices', async (req, res) => {
    try {
        const { serviceName, carType, price, description } = req.body;
        // Simple upsert logic
        let service = await ServicePrice.findOneAndUpdate(
            { serviceName, carType },
            { price, description },
            { new: true, upsert: true }
        );
        res.json(service);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Create Booking
router.post('/bookings', auth, async (req, res) => {
    try {
        const { carModel, carType, serviceType, price, pickupDate, phone } = req.body;
        const newBooking = new Booking({
            userId: req.user.id,
            userName: "Customer", // Placeholder logic
            carModel,
            carType,
            serviceType,
            price,
            pickupDate,
            phone
        });

        const booking = await newBooking.save();
        res.json(booking);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Add Feedback
router.post('/bookings/:id/feedback', auth, async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const booking = await Booking.findById(req.params.id);

        if (!booking) return res.status(404).json({ msg: 'Booking not found' });

        const logMsg = `[DEBUG] Feedback Auth Check - Booking User: ${booking.userId} (${typeof booking.userId}), Request User: ${req.user.id} (${typeof req.user.id})\n`;
        console.log(logMsg);
        console.log(logMsg);
        // fs.appendFileSync('debug_auth.log', logMsg); // Removed to prevent Vercel crash (Read-only FS)

        if (booking.userId.toString() !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });
        if (booking.status !== 'Completed') return res.status(400).json({ msg: 'Order must be completed to leave feedback' });

        booking.feedback = { rating, comment };
        await booking.save();
        res.json(booking);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Cancel Booking (User Cancellation - Soft Delete)
// Cancel Booking (User Cancellation - Soft Delete)
// Request Cancellation OTP
router.post('/bookings/:id/request-cancel-otp', auth, async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) return res.status(404).json({ msg: 'Booking not found' });
        if (booking.userId.toString() !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });
        if (booking.status !== 'Pending') return res.status(400).json({ msg: 'Cannot cancel non-pending order' });

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Save OTP to booking (expires in 10 mins)
        booking.cancelOtp = otp;
        booking.cancelOtpExpires = Date.now() + 10 * 60 * 1000;
        await booking.save();

        // Simulate SMS sending
        console.log(`[OTP SENT] Sending OTP ${otp} to phone ${booking.phone} for Booking ${booking._id}`);

        // DEV: Sending OTP in response for easy testing since we don't have SMS gateway
        res.json({ msg: 'OTP sent to mobile', debugOtp: otp });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Cancel Booking (User Cancellation - Soft Delete) with OTP
router.put('/bookings/:id/cancel', auth, async (req, res) => {
    console.log(`[CANCEL REQUEST] User: ${req.user.id}, BookingID: ${req.params.id}`);
    try {
        const { otp } = req.body;
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            console.log(`[CANCEL FAIL] Booking not found: ${req.params.id}`);
            return res.status(404).json({ msg: 'Booking not found' });
        }

        console.log(`[CANCEL DEBUG] Booking User: ${booking.userId}, Request User: ${req.user.id}, Status: ${booking.status}`);

        if (booking.userId.toString() !== req.user.id) {
            console.log(`[CANCEL FAIL] Unauthorized`);
            return res.status(401).json({ msg: 'Not authorized' });
        }
        if (booking.status !== 'Pending') {
            console.log(`[CANCEL FAIL] Status not Pending: ${booking.status}`);
            return res.status(400).json({ msg: `Cannot cancel order that is ${booking.status}` });
        }

        // OTP Verification
        if (!otp) {
            return res.status(400).json({ msg: 'OTP is required' });
        }
        if (booking.cancelOtp !== otp) {
            return res.status(400).json({ msg: 'Invalid OTP' });
        }
        if (booking.cancelOtpExpires < Date.now()) {
            return res.status(400).json({ msg: 'OTP has expired' });
        }

        booking.status = 'Cancelled';
        booking.cancelOtp = undefined; // Clear OTP
        booking.cancelOtpExpires = undefined;
        await booking.save();
        console.log(`[CANCEL SUCCESS] Booking ${req.params.id} cancelled`);
        res.json(booking);
    } catch (err) {
        console.error("[CANCEL ERROR] Server Error:", err.message);
        res.status(500).json({ msg: 'Server Error', error: err.message });
    }
});

// Get User Bookings
router.get('/my-bookings', auth, async (req, res) => {
    try {
        const bookings = await Booking.find({ userId: req.user.id }).sort({ date: -1 });
        res.json(bookings);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Admin: Get All Bookings
router.get('/all-bookings', async (req, res) => { // Add admin auth middleware later
    try {
        const bookings = await Booking.find().sort({ date: -1 });
        res.json(bookings);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Admin: Update Status
router.put('/bookings/:id', async (req, res) => {
    try {
        const { status } = req.body;
        const booking = await Booking.findByIdAndUpdate(req.params.id, { status }, { new: true });
        res.json(booking);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Admin: Get All Contacts
router.get('/contacts', async (req, res) => {
    try {
        const contacts = await Contact.find().sort({ date: -1 }); // Assuming Contact model has date/createdAt
        res.json(contacts);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Contact Form Submission
router.post('/contact', async (req, res) => {
    try {
        const { firstName, lastName, email, message } = req.body;

        // Basic Validation
        if (!firstName || !email || !message) {
            return res.status(400).json({ msg: 'Please fill in all required fields' });
        }

        const newContact = new Contact({
            firstName,
            lastName,
            email,
            message
        });

        await newContact.save();

        // Send Email via Nodemailer
        try {
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS
                }
            });

            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: 'kameswarraodasetti@gmail.com',
                subject: `New Contact Message from ${firstName} ${lastName}`,
                text: `
                    Name: ${firstName} ${lastName}
                    Email: ${email}
                    
                    Message:
                    ${message}
                `
            };

            await transporter.sendMail(mailOptions);
            res.json({ msg: 'Message sent successfully' });

        } catch (emailError) {
            console.error("Email API Error:", emailError);
            // Return 200 so the frontend considers it a "success" (message saved), but warn in the response.
            // The Admin Dashboard will still show the message.
            res.json({
                msg: 'Message saved to Dashboard, but email failed. Check Admin Panel.',
                warning: 'Email authentication failed. Check server logs.'
            });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
