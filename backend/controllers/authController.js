// backend/controllers/authController.js

const login = async (req, res) => {
  // 👈 ADD IT HERE (Top of the function)
  console.log("Incoming Login Data:", req.body);

  try {
    const { email, password } = req.body;
    // ... existing login logic
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { login };