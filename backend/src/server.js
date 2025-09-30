// src/server.js - Update this section
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes - Make sure all are properly connected
app.use('/api/apartments', require('./routes/apartments'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/tenants', require('./routes/tenants'));
app.use('/api/maintenance', require('./routes/maintenance'));
app.use('/api/payments', require('./routes/payments'));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Database connection
mongoose.connect(process.env.MONGODB_URL || 'mongodb://localhost:27017/apartment_manager')  .then(() => console.log('📦 Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});