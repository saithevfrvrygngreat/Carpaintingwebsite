const mongoose = require('mongoose');

const servicePriceSchema = new mongoose.Schema({
    serviceName: { type: String, required: true }, // e.g., "Dent Removal", "Full Paint"
    carType: { type: String, enum: ['Hatchback', 'Sedan', 'SUV', 'Luxury'], required: true },
    price: { type: Number, required: true },
    description: { type: String }
});

module.exports = mongoose.model('ServicePrice', servicePriceSchema);
