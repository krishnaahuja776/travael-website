const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');

// AI Itinerary Generator
router.post('/generate', auth, async (req, res) => {
    try {
        const { destination, days, budget, interests, travelers } = req.body;

        // AI-powered itinerary generation logic
        const itinerary = generateAIItinerary(destination, days, budget, interests, travelers);

        res.json({
            destination,
            days,
            budget,
            itinerary,
            generatedAt: new Date()
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

function generateAIItinerary(destination, days, budget, interests, travelers) {
    const activities = {
        adventure: ['Trekking', 'Paragliding', 'River Rafting', 'Rock Climbing', 'Safari'],
        relaxation: ['Spa Day', 'Beach Time', 'Yoga Retreat', 'Sunset Cruise', 'Hot Springs'],
        cultural: ['Museum Visit', 'Local Market Tour', 'Cooking Class', 'Heritage Walk', 'Festival'],
        family: ['Amusement Park', 'Zoo Visit', 'Boat Ride', 'Picnic', 'Aquarium']
    };

    const itinerary = [];
    const selectedActivities = interests.flatMap(i => activities[i] || []);

    for (let day = 1; day <= days; day++) {
        const dayActivities = [];
        const morning = selectedActivities[(day - 1) % selectedActivities.length];
        const afternoon = selectedActivities[(day) % selectedActivities.length];
        const evening = selectedActivities[(day + 1) % selectedActivities.length];

        dayActivities.push(
            { time: '08:00', title: 'Breakfast', description: 'Local cuisine breakfast', cost: budget === 'luxury' ? 50 : 15, type: 'food' },
            { time: '10:00', title: morning, description: `Experience ${morning} in ${destination}`, cost: budget === 'luxury' ? 100 : 30, type: 'activity' },
            { time: '13:00', title: 'Lunch', description: 'Traditional lunch spot', cost: budget === 'luxury' ? 60 : 20, type: 'food' },
            { time: '15:00', title: afternoon, description: `Afternoon ${afternoon} session`, cost: budget === 'luxury' ? 120 : 40, type: 'activity' },
            { time: '19:00', title: evening, description: `Evening ${evening} experience`, cost: budget === 'luxury' ? 150 : 50, type: 'activity' },
            { time: '21:00', title: 'Dinner', description: 'Fine dining experience', cost: budget === 'luxury' ? 100 : 25, type: 'food' }
        );

        itinerary.push({
            day,
            date: new Date(Date.now() + (day - 1) * 86400000),
            activities: dayActivities
        });
    }

    return itinerary;
}

module.exports = router;
