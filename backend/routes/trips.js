const express = require('express');
const router = express.Router();
const Trip = require('../models/Trip');
const { auth } = require('../middleware/auth');

// Get user's trips
router.get('/', auth, async (req, res) => {
    try {
        const trips = await Trip.find({ user: req.user._id })
            .sort({ createdAt: -1 });
        res.json(trips);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create trip
router.post('/', auth, async (req, res) => {
    try {
        const trip = new Trip({ ...req.body, user: req.user._id });
        await trip.save();

        // Add to saved trips
        await User.findByIdAndUpdate(req.user._id, {
            $push: { savedTrips: trip._id }
        });

        res.status(201).json(trip);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update trip
router.put('/:id', auth, async (req, res) => {
    try {
        const trip = await Trip.findOneAndUpdate(
            { _id: req.params.id, user: req.user._id },
            req.body,
            { new: true }
        );
        if (!trip) return res.status(404).json({ error: 'Trip not found' });
        res.json(trip);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete trip
router.delete('/:id', auth, async (req, res) => {
    try {
        await Trip.findOneAndDelete({ _id: req.params.id, user: req.user._id });
        res.json({ message: 'Trip deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
