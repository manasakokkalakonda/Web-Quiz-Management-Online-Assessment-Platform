// backend/routes/questionRoutes.js
const express = require('express');
const Question = require('../models/Question');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

// 1. Add Question to a Quiz (Admin Only)
router.post('/add', verifyToken, isAdmin, async (req, res) => {
  try {
    const { quizId, questionText, options, correctOptionIndex, explanation } = req.body;

    if (!quizId || !questionText || !options || options.length < 2 || correctOptionIndex === undefined) {
      return res.status(400).json({ message: 'Please provide all required question fields and at least two options.' });
    }

    const newQuestion = new Question({
      quizId,
      questionText,
      options,
      correctOptionIndex,
      explanation: explanation || ''
    });

    await newQuestion.save();
    res.status(201).json({ message: 'Question added successfully!', question: newQuestion });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add question.', error: error.message });
  }
});

// 2. Fetch All Questions for a Specific Quiz
router.get('/quiz/:quizId', verifyToken, async (req, res) => {
  try {
    const questions = await Question.find({ quizId: req.params.quizId });
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch questions.', error: error.message });
  }
});

// 3. Edit Question (Admin Only)
router.put('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const updatedQuestion = await Question.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: 'Question updated successfully!', question: updatedQuestion });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update question.', error: error.message });
  }
});

// 4. Delete Question (Admin Only)
router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    await Question.findByIdAndDelete(req.params.id);
    res.json({ message: 'Question deleted successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete question.', error: error.message });
  }
});

module.exports = router;