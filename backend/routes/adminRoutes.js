// backend/routes/adminRoutes.js
const express = require('express');
const User = require('../models/User');
const Quiz = require('../models/Quiz');
const Result = require('../models/Result');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

// Get Admin Dashboard Overview Statistics (Days 4 & 11)
router.get('/stats', verifyToken, isAdmin, async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalAdmins = await User.countDocuments({ role: 'admin' });
    const totalQuizzes = await Quiz.countDocuments();
    const totalAttempts = await Result.countDocuments();

    const passedAttempts = await Result.countDocuments({ status: 'Pass' });
    const failedAttempts = await Result.countDocuments({ status: 'Fail' });

    res.json({
      totalStudents,
      totalAdmins,
      totalQuizzes,
      totalAttempts,
      passedAttempts,
      failedAttempts
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch admin stats.', error: error.message });
  }
});

// Fetch List of All Registered Users
router.get('/users', verifyToken, isAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users.', error: error.message });
  }
});
module.exports = router;