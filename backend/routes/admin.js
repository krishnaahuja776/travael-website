const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Trip = require('../models/Trip');
const Contact = require('../models/Contact');
const Place = require('../models/Place');
const { adminAuth } = require('../middleware/auth');

// Dashboard stats
router.get('/dashboard', adminAuth, async (req, res) => {
    try {
        const stats = {
            totalUsers: await User.countDocuments(),
            totalTrips: await Trip.countDocuments(),
            totalPlaces: await Place.countDocuments(),
            totalContacts: await Contact.countDocuments(),
            newContacts: await Contact.countDocuments({ status: 'new' }),
            recentUsers: await User.find().sort({ createdAt: -1 }).limit(5).select('-password'),
            recentTrips: await Trip.find().sort({ createdAt: -1 }).limit(5).populate('user', 'name email'),
            recentContacts: await Contact.find().sort({ createdAt: -1 }).limit(5)
        };
        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all trips
router.get('/trips', adminAuth, async (req, res) => {
    try {
        const trips = await Trip.find()
            .populate('user', 'name email')
            .sort({ createdAt: -1 });
        res.json(trips);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
