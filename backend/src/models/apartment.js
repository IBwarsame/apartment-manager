// src/models/apartment.js
const mongoose = require('mongoose');

const apartmentSchema = new mongoose.Schema({
  number: { type: String, required: true, unique: true },
  floor: { type: Number, required: true },
  bedrooms: { type: Number, required: true },
  bathrooms: { type: Number, required: true },
  rent: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['available', 'occupied', 'maintenance'], 
    default: 'available' 
  },
  amenities: [String],
  notes: String
}, { timestamps: true });

module.exports = mongoose.model('Apartment', apartmentSchema);