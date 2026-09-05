const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const authRoutes = require('./routes/auth');
const volunteerRoutes = require('./routes/volunteers');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// API Endpoints v1
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/volunteers', volunteerRoutes);
app.use('/api/v1/admin', adminRoutes);

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', system: 'InAmigos Volunteer Management & Triage' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`InAmigos Backend running on port ${PORT}`);
  });
}

module.exports = app;
