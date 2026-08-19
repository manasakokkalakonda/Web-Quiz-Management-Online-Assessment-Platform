const Question = require('../models/Question');
const Quiz = require('../models/Quiz');

// @desc    Add a question to a specific quiz (Admin only)
// @route   POST /api/questions
exports.addQuestion = async (req, res) => {
  try {
    const { quizId, text, options, correctAnswerIndex, explanation } = req.body;

    const question = new Question({
      quiz: quizId,
      text,
      options,
      correctAnswerIndex,
      explanation
    });

    await question.save();

    // Link question to the quiz model
    await Quiz.findByIdAndUpdate(quizId, { $push: { questions: question._id } });

    res.status(201).json(question);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update a question (Admin only)
// @route   PUT /api/questions/:id
exports.updateQuestion = async (req, res) => {
  try {
    const question = await Question.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    res.json(question);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete a question (Admin only)
// @route   DELETE /api/questions/:id
exports.deleteQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    // Remove reference from quiz
    await Quiz.findByIdAndUpdate(question.quiz, { $pull: { questions: question._id } });
    await question.deleteOne();

    res.json({ message: 'Question removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};