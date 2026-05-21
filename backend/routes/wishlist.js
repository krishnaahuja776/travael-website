const express = require('express');
const router = express.Router();
const Wishlist = require('../models/Wishlist');
const { auth } = require('../middleware/auth');

// Get user's wishlist
router.get('/', auth, async (req, res) => {
    try {
        const wishlist = await Wishlist.find({ user: req.user._id })
            .populate('place')
            .sort({ createdAt: -1 });
        res.json(wishlist);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add to wishlist
router.post('/', auth, async (req, res) => {
    try {
        const { placeId, notes, priority } = req.body;

        const existing = await Wishlist.findOne({ user: req.user._id, place: placeId });
        if (existing) {
            return res.status(400).json({ error: 'Already in wishlist' });
        }

        const wishlist = new Wishlist({
            user: req.user._id,
            place: placeId,
            notes,
            priority
        });
        await wishlist.save();

        res.status(201).json(wishlist);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Remove from wishlist
router.delete('/:id', auth, async (req, res) => {
    try {
        await Wishlist.findOneAndDelete({ _id: req.params.id, user: req.user._id });
        res.json({ message: 'Removed from wishlist' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
