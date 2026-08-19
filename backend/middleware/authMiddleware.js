// backend/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

// 1. Check if user is logged in (has valid token)
const verifyToken = (req, res, next) => {
  const tokenHeader = req.headers['authorization'];

  if (!tokenHeader) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  // Format usually sent from frontend: "Bearer <token>"
  const token = tokenHeader.startsWith('Bearer ')
    ? tokenHeader.split(' ')[1]
    : tokenHeader;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'mysecretkey123');
    req.user = decoded; // Attach decoded payload (userId, role) to request
    next(); // Pass control to next handler
  } catch (error) {
    return res.status(403).json({ message: 'Invalid or expired token.' });
  }
};

// 2. Check if user is an Admin
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next(); // User is admin, proceed
  } else {
    return res.status(403).json({ message: 'Access restricted to administrators only.' });
  }
};

// 3. Check if user is a Student
const isStudent = (req, res, next) => {
  if (req.user && req.user.role === 'student') {
    next(); // User is student, proceed
  } else {
    return res.status(403).json({ message: 'Access restricted to students only.' });
  }
};

module.exports = {
  verifyToken,
  isAdmin,
  isStudent
};