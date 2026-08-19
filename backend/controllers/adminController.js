const User = require('../models/User');
const Quiz = require('../models/Quiz');
const Result = require('../models/Result');

// @desc    Get overall admin dashboard statistics
// @route   GET /api/admin/analytics
exports.getAdminAnalytics = async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalQuizzes = await Quiz.countDocuments();
    const totalAttempts = await Result.countDocuments();

    const results = await Result.find();
    const passedCount = results.filter((r) => r.passed).length;
    const passRate = totalAttempts > 0 ? ((passedCount / totalAttempts) * 100).toFixed(2) : 0;

    res.json({
      totalStudents,
      totalQuizzes,
      totalAttempts,
      passRate
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};