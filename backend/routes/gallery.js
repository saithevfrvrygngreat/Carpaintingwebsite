const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Gallery = require('../models/Gallery');
const auth = require('../middleware/auth');

// Multer Config
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: function (req, file, cb) {
        cb(null, 'IMAGE-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 }, // 1MB limit
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

// Get All Images
router.get('/', async (req, res) => {
    try {
        const images = await Gallery.find().sort({ date: -1 });
        res.json(images);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Admin: Upload Image
router.post('/', auth, (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ msg: err });
        } else {
            if (req.file == undefined) {
                return res.status(400).json({ msg: 'No File Selected!' });
            } else {
                try {
                    const newImage = new Gallery({
                        imageUrl: `/uploads/${req.file.filename}`,
                        title: req.body.title || 'Work Sample'
                    });
                    await newImage.save();
                    res.json(newImage);
                } catch (error) {
                    res.status(500).send('Server Error');
                }
            }
        }
    });
});

module.exports = router;
