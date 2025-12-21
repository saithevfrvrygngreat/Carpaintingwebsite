const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load env vars (for Atlas URI)
dotenv.config();

const LOCAL_URI = 'mongodb://localhost:27017/car-painting-db';
const ATLAS_URI = process.env.MONGO_URI;

if (!ATLAS_URI) {
    console.error('Error: MONGO_URI not found in .env');
    process.exit(1);
}

// Define raw schemas to read everything without validation errors
const Schema = mongoose.Schema;
const AnySchema = new Schema({}, { strict: false });

async function migrate() {
    console.log('Step 1: Connecting to LOCAL database...');
    const localConn = await mongoose.createConnection(LOCAL_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to Local.');

    // Define models on the local connection
    const LocalUser = localConn.model('User', AnySchema);
    const LocalBooking = localConn.model('Booking', AnySchema);
    const LocalContact = localConn.model('Contact', AnySchema);
    const LocalGallery = localConn.model('Gallery', AnySchema);
    const LocalServicePrice = localConn.model('ServicePrice', AnySchema);

    // Fetch all data
    console.log('Fetching local data...');
    const users = await LocalUser.find({});
    const bookings = await LocalBooking.find({});
    const contacts = await LocalContact.find({});
    const galleries = await LocalGallery.find({});
    const servicePrices = await LocalServicePrice.find({});

    console.log(`Found: ${users.length} Users, ${bookings.length} Bookings, ${contacts.length} Contacts, ${galleries.length} Galleries, ${servicePrices.length} Prices.`);

    // Close local
    await localConn.close();
    console.log('Closed local connection.');

    // Connect to Atlas
    console.log('Step 2: Connecting to ATLAS database...');
    const atlasConn = await mongoose.createConnection(ATLAS_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to Atlas.');

    const AtlasUser = atlasConn.model('User', AnySchema);
    const AtlasBooking = atlasConn.model('Booking', AnySchema);
    const AtlasContact = atlasConn.model('Contact', AnySchema);
    const AtlasGallery = atlasConn.model('Gallery', AnySchema);
    const AtlasServicePrice = atlasConn.model('ServicePrice', AnySchema);

    // Clear Atlas Collections (Optional: to ensure exact copy)
    console.log('Clearing existing Atlas data (to prevent duplicates)...');
    await AtlasUser.deleteMany({});
    await AtlasBooking.deleteMany({});
    await AtlasContact.deleteMany({});
    await AtlasGallery.deleteMany({});
    await AtlasServicePrice.deleteMany({});

    // Operations
    console.log('Inserting data into Atlas...');
    if (users.length) await AtlasUser.insertMany(users);
    if (bookings.length) await AtlasBooking.insertMany(bookings);
    if (contacts.length) await AtlasContact.insertMany(contacts);
    if (galleries.length) await AtlasGallery.insertMany(galleries);
    if (servicePrices.length) await AtlasServicePrice.insertMany(servicePrices);

    console.log('Migration Complete! 🚀');
    await atlasConn.close();
}

migrate().catch(err => console.error(err));
