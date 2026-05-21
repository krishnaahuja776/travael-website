const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    destination: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    travelers: { type: Number, default: 1 },
    budget: {
        total: Number,
        accommodation: Number,
        transport: Number,
        food: Number,
        activities: Number,
        miscellaneous: Number
    },
    itinerary: [{
        day: Number,
        date: Date,
        activities: [{
            time: String,
            title: String,
            description: String,
            location: String,
            cost: Number,
            type: { type: String, enum: ['transport', 'sightseeing', 'food', 'accommodation', 'activity'] }
        }]
    }],
    status: { type: String, enum: ['planned', 'ongoing', 'completed', 'cancelled'], default: 'planned' },
    isPublic: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Trip', tripSchema);
