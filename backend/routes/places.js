const express = require('express');
const router = express.Router();
const Place = require('../models/Place');
const { auth } = require('../middleware/auth');

// Get all places
router.get('/', async (req, res) => {
    try {
        const { category, search, sort, limit = 20 } = req.query;
        let query = {};

        if (category) query.category = category;
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { 'location.city': { $regex: search, $options: 'i' } }
            ];
        }

        let places = Place.find(query);

        if (sort === 'rating') places = places.sort({ rating: -1 });
        if (sort === 'newest') places = places.sort({ createdAt: -1 });

        places = await places.limit(parseInt(limit));
        res.json(places);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get nearby places
router.get('/nearby', async (req, res) => {
    try {
        const { lat, lng, radius = 50, category } = req.query;

        let query = {
            'location.coordinates': {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [parseFloat(lng), parseFloat(lat)]
                    },
                    $maxDistance: parseInt(radius) * 1000
                }
            }
        };

        if (category) query.category = category;

        const places = await Place.find(query).limit(20);
        res.json(places);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get single place
router.get('/:id', async (req, res) => {
    try {
        const place = await Place.findById(req.params.id);
        if (!place) return res.status(404).json({ error: 'Place not found' });
        res.json(place);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create place (admin)
router.post('/', auth, async (req, res) => {
    try {
        const place = new Place(req.body);
        await place.save();
        res.status(201).json(place);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
