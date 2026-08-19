// backend/routes/leaderboardRoutes.js
const express = require('express');
const Result = require('../models/Result');
const Quiz = require('../models/Quiz');
const { verifyToken } = require('../middleware/authMiddleware');

const router = express.Router();

// 1. Overall Global Leaderboard (Top 10 High Scorers)
router.get('/global', verifyToken, async (req, res) => {
  try {
    const leaderboard = await Result.aggregate([
      {
        $group: {
          _id: '$studentId',
          totalScore: { $sum: '$score' },
          totalQuizzes: { $sum: 1 },
          avgPercentage: { $avg: '$percentage' }
        }
      },
      { $sort: { totalScore: -1, avgPercentage: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'student'
        }
      },
      { $unwind: '$student' },
      {
        $project: {
          _id: 1,
          studentName: '$student.name',
          totalScore: 1,
          totalQuizzes: 1,
          avgPercentage: { $round: ['$avgPercentage', 1] }
        }
      }
    ]);

    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch global leaderboard.', error: error.message });
  }
});

// 2. Leaderboard by Specific Quiz Category
router.get('/category/:categoryName', verifyToken, async (req, res) => {
  try {
    const { categoryName } = req.params;

    // Find all quizzes in this category
    const categoryQuizzes = await Quiz.find({ category: categoryName }).select('_id');
    const quizIds = categoryQuizzes.map((q) => q._id);

    const leaderboard = await Result.aggregate([
      { $match: { quizId: { $in: quizIds } } },
      {
        $group: {
          _id: '$studentId',
          totalScore: { $sum: '$score' },
          totalQuizzes: { $sum: 1 },
          avgPercentage: { $avg: '$percentage' }
        }
      },
      { $sort: { totalScore: -1, avgPercentage: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'student'
        }
      },
      { $unwind: '$student' },
      {
        $project: {
          _id: 1,
          studentName: '$student.name',
          totalScore: 1,
          totalQuizzes: 1,
          avgPercentage: { $round: ['$avgPercentage', 1] }
        }
      }
    ]);

    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch category leaderboard.', error: error.message });
  }
});

module.exports = router;