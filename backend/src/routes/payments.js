const express = require('express');
const router = express.Router();
const Payment = require('../models/payment');

// Get all payments
router.get('/', async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate('apartment', 'number')
      .populate('booking', 'tenantName')
      .sort({ dueDate: -1 });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get payments by apartment
router.get('/apartment/:apartmentId', async (req, res) => {
  try {
    const payments = await Payment.find({ apartment: req.params.apartmentId })
      .populate('booking', 'tenantName')
      .sort({ dueDate: -1 });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create payment
router.post('/', async (req, res) => {
  try {
    const payment = new Payment(req.body);
    const savedPayment = await payment.save();
    const populatedPayment = await Payment.findById(savedPayment._id)
      .populate('apartment', 'number')
      .populate('booking', 'tenantName');
    res.status(201).json(populatedPayment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update payment (mark as paid)
router.put('/:id', async (req, res) => {
  try {
    const payment = await Payment.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    ).populate('apartment', 'number').populate('booking', 'tenantName');
    if (!payment) return res.status(404).json({ error: 'Payment not found' });
    res.json(payment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;