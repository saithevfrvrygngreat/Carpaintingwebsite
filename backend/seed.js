const mongoose = require('mongoose');
const dotenv = require('dotenv');
const ServicePrice = require('./models/ServicePrice');

dotenv.config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/car-painting-db', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

const seedPrices = async () => {
    const prices = [
        { serviceName: 'Dent Removal', carType: 'Hatchback', price: 3000 },
        { serviceName: 'Dent Removal', carType: 'Sedan', price: 4500 },
        { serviceName: 'Dent Removal', carType: 'SUV', price: 6000 },
        { serviceName: 'Dent Removal', carType: 'Luxury', price: 8000 },

        { serviceName: 'Full Paint', carType: 'Hatchback', price: 25000 },
        { serviceName: 'Full Paint', carType: 'Sedan', price: 35000 },
        { serviceName: 'Full Paint', carType: 'SUV', price: 45000 },
        { serviceName: 'Full Paint', carType: 'Luxury', price: 60000 },

        { serviceName: 'Stickering', carType: 'Hatchback', price: 5000 },
        { serviceName: 'Stickering', carType: 'Sedan', price: 7000 },
        { serviceName: 'Stickering', carType: 'SUV', price: 10000 },
        { serviceName: 'Stickering', carType: 'Luxury', price: 15000 },
    ];

    try {
        await ServicePrice.deleteMany();
        await ServicePrice.insertMany(prices);
        console.log('Prices Seeded');
    } catch (err) {
        console.error('Error seeding prices:', err);
    }
};

const seedAdmin = async () => {
    const User = require('./models/User');
    const adminEmail = 'kameswarraodasetti@gmail.com';
    const adminPass = 'Kamesh@1982';

    try {
        let admin = await User.findOne({ email: adminEmail });
        if (!admin) {
            admin = new User({
                name: 'Kameshwar Rao',
                email: adminEmail,
                password: adminPass, // Will be hashed by pre-save hook
                phone: '9999999999',
                role: 'admin'
            });
            await admin.save();
            console.log('Super Admin Created');
        } else {
            console.log('Admin already exists');
        }
    } catch (err) {
        console.error('Error seeding admin:', err);
    }
};

const runSeeds = async () => {
    await seedPrices();
    await seedAdmin();
    process.exit();
};

runSeeds();
