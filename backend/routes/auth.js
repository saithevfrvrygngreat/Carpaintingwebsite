const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth'); // Ensure auth middleware is imported
const multer = require('multer');
const path = require('path');

// Multer Config for Avatar
// Multer Config for Avatar
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../uploads/'));
    },
    filename: function (req, file, cb) {
        cb(null, 'AVATAR-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 50000000 }, // 50MB limit
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
}).single('image');

function checkFileType(file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Images Only!');
    }
}

// Register
router.post('/register', async (req, res) => {
    try {
        const { name, phone } = req.body;
        let { email, password } = req.body;
        email = email.toLowerCase().trim();
        password = password.trim();

        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ msg: 'User already exists' });

        user = new User({ name, email, password, phone });
        await user.save();

        const payload = { user: { id: user.id, role: user.role } };
        jwt.sign(payload, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' }, (err, token) => {
            if (err) throw err;
            res.json({
                token,
                user: { id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role, date: user.date, profileImage: user.profileImage }
            });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        let { email, password } = req.body;
        email = email.toLowerCase().trim();
        password = password.trim();

        let user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: 'Invalid Credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid Credentials' });

        const payload = { user: { id: user.id, role: user.role } };
        jwt.sign(payload, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' }, (err, token) => {
            if (err) throw err;
            res.json({
                token,
                user: { id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role, date: user.date, profileImage: user.profileImage }
            });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Get All Users (Admin Only)
router.get('/users', async (req, res) => {
    try {
        // Simple check for now, ideally use middleware
        const users = await User.find().select('-password').sort({ date: -1 });
        res.json(users);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Verify Token & Get User (For AuthContext)
router.get('/me', require('../middleware/auth'), async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json({ user, role: user.role });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Upload Avatar
router.post('/upload-avatar', auth, (req, res) => {
    console.log('[DEBUG] /upload-avatar hit');
    upload(req, res, async (err) => {
        if (err) {
            console.error('[DEBUG] Multer Error:', err);
            return res.status(400).json({ msg: err }); // Multer error
        } else {
            console.log('[DEBUG] File received:', req.file);
            if (req.file == undefined) {
                return res.status(400).json({ msg: 'No File Selected!' });
            } else {
                try {
                    // Update user's profile image in DB
                    let user = await User.findById(req.user.id);
                    user.profileImage = `/uploads/${req.file.filename}`;
                    await user.save();

                    res.json({
                        msg: 'Avatar Uploaded',
                        filePath: `/uploads/${req.file.filename}`,
                        user: {
                            id: user._id,
                            name: user.name,
                            email: user.email,
                            phone: user.phone,
                            role: user.role,
                            date: user.date,
                            profileImage: user.profileImage
                        }
                    });
                } catch (error) {
                    console.error('[DEBUG] DB Save Error:', error);
                    res.status(500).send('Server Error');
                }
            }
        }
    });
});

// Update Profile (Route: PUT /api/auth/profile)
router.put('/profile', auth, async (req, res) => {
    const { name, phone } = req.body;
    const bookingFields = {};
    if (name) bookingFields.name = name;
    if (phone) bookingFields.phone = phone;

    try {
        let user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ msg: 'User not found' });

        // Update fields
        if (name) user.name = name;
        if (phone) user.phone = phone;

        await user.save();

        res.json({
            msg: 'Profile Updated',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                date: user.date,
                profileImage: user.profileImage
            }
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Change Password
router.put('/change-password', auth, async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ msg: 'User not found' });

        // Check current password
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Incorrect current password' });
        }

        // Update password (will be hashed by User model pre-save middleware)
        user.password = newPassword.trim();

        await user.save();
        res.json({ msg: 'Password updated successfully' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
