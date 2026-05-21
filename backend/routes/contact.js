const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const { adminAuth } = require('../middleware/auth');

// Submit contact form
router.post('/', async (req, res) => {
    try {
        const contact = new Contact(req.body);
        await contact.save();
        res.status(201).json({ message: 'Message sent successfully!', contact });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all contacts (admin)
router.get('/', adminAuth, async (req, res) => {
    try {
        const contacts = await Contact.find().sort({ createdAt: -1 });
        res.json(contacts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update contact status
router.put('/:id', adminAuth, async (req, res) => {
    try {
        const contact = await Contact.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status },
            { new: true }
        );
        res.json(contact);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
