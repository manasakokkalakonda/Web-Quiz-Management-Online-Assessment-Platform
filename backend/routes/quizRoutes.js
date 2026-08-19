// backend/routes/quizRoutes.js
const express = require('express');
const Quiz = require('../models/Quiz');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

// 1. Create a New Quiz (Admin Only)
router.post('/create', verifyToken, isAdmin, async (req, res) => {
  try {
    const { title, description, category, timeLimitInMinutes } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required.' });
    }

    const newQuiz = new Quiz({
      title,
      description,
      category,
      timeLimitInMinutes,
      createdBy: req.user.userId
    });

    await newQuiz.save();
    res.status(201).json({ message: 'Quiz created successfully!', quiz: newQuiz });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create quiz.', error: error.message });
  }
});

// 2. Fetch All Quizzes
router.get('/', verifyToken, async (req, res) => {
  try {
    const quizzes = await Quiz.find();
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch quizzes.', error: error.message });
  }
});

// 3. Edit Quiz (Admin Only)
router.put('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const updatedQuiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: 'Quiz updated successfully!', quiz: updatedQuiz });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update quiz.', error: error.message });
  }
});

// 4. Delete Quiz (Admin Only)
router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    await Quiz.findByIdAndDelete(req.params.id);
    res.json({ message: 'Quiz deleted successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete quiz.', error: error.message });
  }
});

// 5. Toggle Publish/Unpublish Status (Admin Only)
router.patch('/:id/publish', verifyToken, isAdmin, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found.' });
    }

    quiz.isPublished = !quiz.isPublished;
    await quiz.save();

    res.json({ message: `Quiz status changed to ${quiz.isPublished ? 'Published' : 'Draft'}.`, quiz });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update publish status.', error: error.message });
  }
});

module.exports = router;