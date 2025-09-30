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

// Create apartment with duplicate check
router.post('/', async (req, res) => {
  try {
    // Check if apartment number already exists
    const existingApartment = await Apartment.findOne({ number: req.body.number });
    if (existingApartment) {
      return res.status(400).json({ 
        error: `Apartment ${req.body.number} already exists` 
      });
    }

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
    // Check if apartment number is being changed and if it already exists
    if (req.body.number) {
      const existingApartment = await Apartment.findOne({ 
        number: req.body.number, 
        _id: { $ne: req.params.id } 
      });
      if (existingApartment) {
        return res.status(400).json({ 
          error: `Apartment ${req.body.number} already exists` 
        });
      }
    }

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