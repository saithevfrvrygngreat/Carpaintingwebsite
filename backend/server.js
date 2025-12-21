const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
    origin: ["https://carpaintingwebsite-m4t6.vercel.app", "http://localhost:5173", "http://localhost:5000", "https://car-painting-website-liard.vercel.app"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
}));

// DEBUG: Request Logger
app.use((req, res, next) => {
    console.log(`[DEBUG] ${req.method} ${req.originalUrl}`);
    next();
});

// Database Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/car-painting-db', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log('DB Connection Error:', err));

app.use('/api/auth', require('./routes/auth'));
app.use('/api', require('./routes/api'));
app.use('/api/gallery', require('./routes/gallery'));

const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
// Ensure uploads directory exists (Try-catch for Vercel read-only FS)
const uploadDir = path.join(__dirname, 'uploads');
try {
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir);
    }
} catch (err) {
    console.log("Warning: Could not create uploads directory (likely read-only fs on Vercel). Image uploads will fail.");
}

// Serve Uploads
app.use('/uploads', express.static(uploadDir));

app.get('/', (req, res) => {
    res.send('Car Painting Service API Running');
});

if (require.main === module) {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
