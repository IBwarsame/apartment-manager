const express = require('express');
const router = express.Router();
const Tenant = require('../models/tenant');
const Apartment = require('../models/apartment');

// Get all tenants
router.get('/', async (req, res) => {
  try {
    const tenants = await Tenant.find().populate('apartment');
    res.json(tenants);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new tenant
router.post('/', async (req, res) => {
    try {
      // 1. Check if apartment exists
      const apartment = await Apartment.findById(req.body.apartment);
      if (!apartment) {
        return res.status(404).json({ error: "Apartment not found" });
      }
  
      // 2. Block if apartment is occupied
      if (apartment.status === "occupied") {
        return res
          .status(400)
          .json({ error: `Apartment ${apartment.number} is already occupied` });
      }
  
      // 3. Create tenant
      const tenant = new Tenant(req.body);
      const savedTenant = await tenant.save();
  
      // 4. Flip apartment status → occupied
      apartment.status = "occupied";
      await apartment.save();
  
      // 5. Return tenant with populated apartment data (show updated status)
      const populatedTenant = await Tenant.findById(savedTenant._id).populate(
        "apartment"
      );
  
      res.status(201).json(populatedTenant);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

// Delete a tenant
router.delete('/:id', async (req, res) => {
  try {
    const tenant = await Tenant.findByIdAndDelete(req.params.id);

    if (!tenant) return res.status(404).json({ error: 'Tenant not found' });

    // Free apartment when tenant removed
    await Apartment.findByIdAndUpdate(tenant.apartment, { status: 'available' });

    res.json({ message: 'Tenant deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update tenant
router.put('/:id', async (req, res) => {
    try {
      const tenant = await Tenant.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );
  
      if (!tenant) return res.status(404).json({ error: 'Tenant not found' });
  
      // 🔑 If tenant becomes ended → mark apartment available
      if (tenant.status === 'ended') {
        await Apartment.findByIdAndUpdate(tenant.apartment, { status: 'available' });
      }
  
      res.json(tenant);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

module.exports = router;