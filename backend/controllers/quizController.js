const Quiz = require('../models/Quiz');

// @desc    Get all active/published quizzes
// @route   GET /api/quizzes
exports.getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find({ isPublished: true }).populate('questions');
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Create a new quiz (Admin only)
// @route   POST /api/quizzes
exports.createQuiz = async (req, res) => {
  try {
    const { title, description, category, duration, passPercentage } = req.body;

    const quiz = new Quiz({
      title,
      description,
      category,
      duration,
      passPercentage,
      createdBy: req.user.userId
    });

    await quiz.save();
    res.status(201).json(quiz);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update quiz details or publishing status (Admin only)
// @route   PUT /api/quizzes/:id
exports.updateQuiz = async (req, res) => {
  try {
    const updatedQuiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedQuiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    res.json(updatedQuiz);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete quiz (Admin only)
// @route   DELETE /api/quizzes/:id
exports.deleteQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findByIdAndDelete(req.params.id);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    res.json({ message: 'Quiz deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};