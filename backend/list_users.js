const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/car-painting-db', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(async () => {
        console.log('MongoDB Connected');
        try {
            const users = await User.find({}, 'email role');
            console.log('Users found:');
            users.forEach(u => console.log(`- ${u.email} (${u.role})`));
        } catch (err) {
            console.error(err);
        } finally {
            process.exit();
        }
    })
    .catch(err => {
        console.log(err);
        process.exit(1);
    });
