// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// Application Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/quizzes', require('./routes/quizRoutes'));
app.use('/api/questions', require('./routes/questionRoutes'));
app.use('/api/student', require('./routes/studentRoutes'));
app.use('/api/leaderboard', require('./routes/leaderboardRoutes'));

// Root Health Check Route
app.get('/', (req, res) => {
  res.send('Quiz Platform Backend Server is running smoothly!');
});

// 404 Route Not Found Handler
app.use((req, res, next) => {
  res.status(404).json({ message: 'Requested API endpoint does not exist.' });
});

// Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err.stack);
  res.status(500).json({
    message: 'An unexpected internal server error occurred.',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB successfully!');
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Database connection error:', error.message);
  });