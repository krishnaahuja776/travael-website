const mongoose = require('mongoose');

const placeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    location: {
        city: String,
        state: String,
        country: String,
        coordinates: {
            lat: Number,
            lng: Number
        }
    },
    images: [String],
    category: { type: String, enum: ['beach', 'mountain', 'city', 'historical', 'adventure', 'religious', 'wildlife'] },
    rating: { type: Number, default: 0 },
    reviews: [{ user: String, comment: String, rating: Number, date: Date }],
    priceRange: { type: String, enum: ['budget', 'standard', 'luxury'] },
    bestTimeToVisit: String,
    activities: [String],
    tags: [String],
    isPopular: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Place', placeSchema);
