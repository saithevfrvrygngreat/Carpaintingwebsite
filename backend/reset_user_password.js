const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/car-painting-db', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

const resetPassword = async () => {
    try {
        const email = 'dasettisaikumar@gmail.com';
        const newPassword = 'password123';

        const user = await User.findOne({ email });
        if (!user) {
            console.log('User not found!');
        } else {
            user.password = newPassword;
            await user.save();
            console.log(`Password for ${email} reset to: ${newPassword}`);
        }
    } catch (err) {
        console.error(err);
    } finally {
        // We need to wait a bit for the connection to close properly or just exit
        setTimeout(() => process.exit(), 1000);
    }
};

resetPassword();
