const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');

// Budget Estimator
router.post('/estimate', async (req, res) => {
    try {
        const { destination, days, travelers, style } = req.body;

        const estimates = calculateBudget(destination, days, travelers, style);

        res.json(estimates);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

function calculateBudget(destination, days, travelers, style) {
    const baseCosts = {
        accommodation: { budget: 30, standard: 80, luxury: 250 },
        food: { budget: 20, standard: 50, luxury: 120 },
        transport: { budget: 15, standard: 40, luxury: 100 },
        activities: { budget: 25, standard: 60, luxury: 150 },
        miscellaneous: { budget: 10, standard: 20, luxury: 50 }
    };

    const styleKey = style || 'standard';

    const breakdown = {
        accommodation: baseCosts.accommodation[styleKey] * days * travelers,
        food: baseCosts.food[styleKey] * days * travelers,
        transport: baseCosts.transport[styleKey] * days * travelers,
        activities: baseCosts.activities[styleKey] * days * travelers,
        miscellaneous: baseCosts.miscellaneous[styleKey] * days * travelers
    };

    const total = Object.values(breakdown).reduce((a, b) => a + b, 0);

    return {
        destination,
        days,
        travelers,
        style: styleKey,
        breakdown,
        total,
        perPerson: total / travelers,
        perDay: total / days,
        currency: 'USD'
    };
}

module.exports = router;
