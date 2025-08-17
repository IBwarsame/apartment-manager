const express = require('express');
const router = express.Router();
const Booking = require('../models/booking');

// Get all bookings
router.get('/', async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('apartment', 'number floor bedrooms')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get booking by apartment
router.get('/apartment/:apartmentId', async (req, res) => {
  try {
    const bookings = await Booking.find({ apartment: req.params.apartmentId })
      .populate('apartment', 'number floor bedrooms')
      .sort({ startDate: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create booking
router.post('/', async (req, res) => {
  try {
    const booking = new Booking(req.body);
    const savedBooking = await booking.save();
    const populatedBooking = await Booking.findById(savedBooking._id)
      .populate('apartment', 'number floor bedrooms');
    res.status(201).json(populatedBooking);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update booking
router.put('/:id', async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    ).populate('apartment', 'number floor bedrooms');
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    res.json(booking);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete booking
router.delete('/:id', async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    res.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;