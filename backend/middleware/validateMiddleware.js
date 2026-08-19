// backend/middleware/validateMiddleware.js

// Validates email format
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Middleware to check required registration fields
const validateRegisterInput = (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || name.trim().length < 2) {
    return res.status(400).json({ message: 'Validation Error: Name must be at least 2 characters long.' });
  }

  if (!email || !isValidEmail(email)) {
    return res.status(400).json({ message: 'Validation Error: Please provide a valid email address.' });
  }

  if (!password || password.length < 6) {
    return res.status(400).json({ message: 'Validation Error: Password must be at least 6 characters long.' });
  }

  next();
};

// Middleware to check required quiz payload fields
const validateQuizInput = (req, res, next) => {
  const { title, description, timeLimitInMinutes } = req.body;

  if (!title || title.trim() === '') {
    return res.status(400).json({ message: 'Validation Error: Quiz title is required.' });
  }

  if (!description || description.trim() === '') {
    return res.status(400).json({ message: 'Validation Error: Quiz description is required.' });
  }

  if (timeLimitInMinutes && (isNaN(timeLimitInMinutes) || timeLimitInMinutes <= 0)) {
    return res.status(400).json({ message: 'Validation Error: Time limit must be a positive number.' });
  }
  next();
};

module.exports = {
  validateRegisterInput,
  validateQuizInput
};