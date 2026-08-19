const rateLimit = require('express-rate-limit');

// Rate limiter to prevent brute-force login attempts
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 attempts per window
  message: { error: 'Too many attempts. Please try again after 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Input validation for quiz submissions
const validateQuizSubmission = (req, res, next) => {
  const { quizId, answers } = req.body;

  if (!quizId || typeof quizId !== 'string') {
    return res.status(400).json({ error: 'A valid Quiz ID is required.' });
  }

  if (!Array.isArray(answers) || answers.length === 0) {
    return res.status(400).json({ error: 'Answers must be provided as a non-empty array.' });
  }

  next();
};

module.exports = { authLimiter, validateQuizSubmission };