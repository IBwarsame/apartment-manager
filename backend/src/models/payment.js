const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
  apartment: { type: mongoose.Schema.Types.ObjectId, ref: 'Apartment', required: true },
  amount: { type: Number, required: true },
  dueDate: { type: Date, required: true },
  paidDate: { type: Date },
  status: { 
    type: String, 
    enum: ['pending', 'paid', 'overdue'], 
    default: 'pending' 
  },
  paymentMethod: String,
  notes: String
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);