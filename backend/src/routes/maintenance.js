const express = require('express');
const router = express.Router();
const Maintenance = require('../models/maintenance');

// Get all maintenance requests
router.get('/', async (req, res) => {
  try {
    const maintenance = await Maintenance.find()
      .populate('apartment', 'number floor')
      .sort({ reportedDate: -1 });
    res.json(maintenance);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get maintenance by apartment
router.get('/apartment/:apartmentId', async (req, res) => {
  try {
    const maintenance = await Maintenance.find({ apartment: req.params.apartmentId })
      .sort({ reportedDate: -1 });
    res.json(maintenance);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create maintenance request
router.post('/', async (req, res) => {
  try {
    const maintenance = new Maintenance(req.body);
    const savedMaintenance = await maintenance.save();
    const populatedMaintenance = await Maintenance.findById(savedMaintenance._id)
      .populate('apartment', 'number floor');
    res.status(201).json(populatedMaintenance);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update maintenance request
router.put('/:id', async (req, res) => {
  try {
    const maintenance = await Maintenance.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    ).populate('apartment', 'number floor');
    if (!maintenance) return res.status(404).json({ error: 'Maintenance request not found' });
    res.json(maintenance);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;