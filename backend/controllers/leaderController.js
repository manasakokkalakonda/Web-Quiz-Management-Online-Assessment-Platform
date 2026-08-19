const Result = require('../models/Result');

// @desc    Get overall leaderboard standings
// @route   GET /api/leaderboard
exports.getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await Result.aggregate([
      {
        $group: {
          _id: '$student',
          totalScore: { $sum: '$score' },
          totalAttempts: { $sum: 1 },
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
          as: 'studentInfo'
        }
      },
      { $unwind: '$studentInfo' },
      {
        $project: {
          _id: 1,
          name: '$studentInfo.name',
          totalScore: 1,
          totalAttempts: 1,
          avgPercentage: { $round: ['$avgPercentage', 2] }
        }
      }
    ]);

    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};