const express = require('express');
const { Favorite } = require('../models');

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const favorites = await Favorite.findAll();
        res.json({ favorites });
    } catch (error) {
        console.error('Error fetching favorites:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/', async (req, res) => {
    try {
        const { baseCurrency, targetCurrency } = req.body;
        await Favorite.create({ baseCurrency, targetCurrency });
        const favorites = await Favorite.findAll();
        res.json({ favorites });
    } catch (error) {
        console.error('Error saving favorite:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
