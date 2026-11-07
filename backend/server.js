const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(express.json());

const allowedOrigins = [
    "https://carpaintingwebsite-m4t6.vercel.app",
    "https://car-painting-website-liard.vercel.app",
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174",
    "http://localhost:3000"
];

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps, curl, server-to-server)
        if (!origin) return callback(null, true);
        if (
            allowedOrigins.includes(origin) ||
            /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin) ||
            /\.vercel\.app$/.test(origin)
        ) {
            return callback(null, true);
        }
        return callback(null, true); // Allow in dev to prevent blocking
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
}));

// Request Logger (filters out frequent 5s dashboard polling)
app.use((req, res, next) => {
    const isPolling = ['/api/all-bookings', '/api/contacts', '/api/auth/users'].includes(req.originalUrl);
    if (!isPolling) {
        console.log(`[HTTP] ${req.method} ${req.originalUrl}`);
    }
    next();
});

// Database Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/car-painting-db', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log(`MongoDB Connected to database: "${mongoose.connection.name}"`))
    .catch(err => console.log('DB Connection Error:', err));

app.use('/api/auth', require('./routes/auth'));
app.use('/api', require('./routes/api'));
app.use('/api/gallery', require('./routes/gallery'));

const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
// Serve Uploads - Only if directory exists
const uploadDir = path.join(__dirname, 'uploads');
try {
    if (!fs.existsSync(uploadDir)) {
        // Only try to make directory if NOT in production (Vercel)
        if (process.env.NODE_ENV !== 'production') {
            fs.mkdirSync(uploadDir);
        }
    }
} catch (err) {
    console.log("Warning: Could not create uploads directory (expected on Vercel).");
}

if (fs.existsSync(uploadDir)) {
    app.use('/uploads', express.static(uploadDir));
} else {
    // Mock the uploads route so it doesn't 404 entire app
    app.use('/uploads', (req, res) => res.status(404).send('Image storage not available on Vercel ephemeral file system'));
}

app.get('/', (req, res) => {
    res.send('Car Painting Service API Running');
});

if (require.main === module) {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
