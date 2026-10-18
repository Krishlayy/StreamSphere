require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');

const authRoutes = require('./routes/auth');
const videoRoutes = require('./routes/videos');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/streamsphere';

// Middlewares
app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/videos', videoRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ONLINE',
    service: 'StreamSphere Media Engine',
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'CONNECTED' : 'DISCONNECTED',
  });
});

// Centralized error handling
app.use((err, req, res, next) => {
  console.error('[StreamSphere Error]:', err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
  });
});

// Database connection & server start
if (process.env.NODE_ENV !== 'test') {
  mongoose
    .connect(MONGODB_URI)
    .then(() => {
      console.log('✅ Connected to MongoDB');
      app.listen(PORT, () => {
        console.log(`🚀 StreamSphere Server running on port ${PORT}`);
      });
    })
    .catch((err) => {
      console.warn('⚠️ MongoDB connection warning (running with mock or disconnected DB):', err.message);
      app.listen(PORT, () => {
        console.log(`🚀 StreamSphere Server running on port ${PORT} (Standalone mode)`);
      });
    });
}

module.exports = app;
