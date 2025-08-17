const express = require('express');
const router = express.Router();
const Apartment = require('../models/apartment');

// Get all apartments
router.get('/', async (req, res) => {
  try {
    const apartments = await Apartment.find().sort({ number: 1 });
    res.json(apartments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single apartment
router.get('/:id', async (req, res) => {
  try {
    const apartment = await Apartment.findById(req.params.id);
    if (!apartment) return res.status(404).json({ error: 'Apartment not found' });
    res.json(apartment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create apartment
router.post('/', async (req, res) => {
  try {
    const apartment = new Apartment(req.body);
    const savedApartment = await apartment.save();
    res.status(201).json(savedApartment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update apartment
router.put('/:id', async (req, res) => {
  try {
    const apartment = await Apartment.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    );
    if (!apartment) return res.status(404).json({ error: 'Apartment not found' });
    res.json(apartment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete apartment
router.delete('/:id', async (req, res) => {
  try {
    const apartment = await Apartment.findByIdAndDelete(req.params.id);
    if (!apartment) return res.status(404).json({ error: 'Apartment not found' });
    res.json({ message: 'Apartment deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;