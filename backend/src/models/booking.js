const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  apartment: { type: mongoose.Schema.Types.ObjectId, ref: 'Apartment', required: true },
  tenantName: { type: String, required: true },
  tenantEmail: { type: String, required: true },
  tenantPhone: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date },
  monthlyRent: { type: Number, required: true },
  deposit: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['active', 'ended', 'pending'], 
    default: 'pending' 
  },
  notes: String
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);