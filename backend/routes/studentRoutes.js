// backend/routes/studentRoutes.js
const express = require('express');
const Quiz = require('../models/Quiz');
const Question = require('../models/Question');
const Result = require('../models/Result');
const { verifyToken, isStudent } = require('../middleware/authMiddleware');

const router = express.Router();

// 1. Fetch All Published Quizzes for Students
router.get('/quizzes', verifyToken, isStudent, async (req, res) => {
  try {
    const quizzes = await Quiz.find({ isPublished: true });
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch published quizzes.', error: error.message });
  }
});

// 2. Fetch Quiz Details and Questions to Start Attempt
router.get('/quiz/:quizId/start', verifyToken, isStudent, async (req, res) => {
  try {
    const { quizId } = req.params;

    const quiz = await Quiz.findById(quizId);
    if (!quiz || !quiz.isPublished) {
      return res.status(404).json({ message: 'Quiz not found or currently unavailable.' });
    }

    const questions = await Question.find({ quizId }).select('-correctOptionIndex -explanation');

    res.json({
      quiz: {
        id: quiz._id,
        title: quiz.title,
        description: quiz.description,
        timeLimitInMinutes: quiz.timeLimitInMinutes,
        imageUrl: quiz.imageUrl
      },
      questions
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to start quiz.', error: error.message });
  }
});

// 3. Submit Quiz & Automatic Score Calculation
router.post('/quiz/:quizId/submit', verifyToken, isStudent, async (req, res) => {
  try {
    const { quizId } = req.params;
    const { userAnswers } = req.body;

    const questions = await Question.find({ quizId });
    if (!questions || questions.length === 0) {
      return res.status(400).json({ message: 'No questions found for this quiz.' });
    }

    let score = 0;
    const evaluatedAnswers = [];

    questions.forEach((question) => {
      const submitted = userAnswers.find(
        (ans) => ans.questionId.toString() === question._id.toString()
      );

      const selectedIndex = submitted ? submitted.selectedOptionIndex : -1;
      const isCorrect = selectedIndex === question.correctOptionIndex;

      if (isCorrect) {
        score += 1;
      }

      evaluatedAnswers.push({
        questionId: question._id,
        selectedOptionIndex: selectedIndex,
        isCorrect
      });
    });

    const totalQuestions = questions.length;
    const percentage = Math.round((score / totalQuestions) * 100);
    const status = percentage >= 50 ? 'Pass' : 'Fail';

    const result = new Result({
      studentId: req.user.userId,
      quizId,
      answers: evaluatedAnswers,
      score,
      totalQuestions,
      percentage,
      status
    });

    await result.save();

    res.status(201).json({
      message: 'Quiz submitted successfully!',
      resultId: result._id,
      score,
      totalQuestions,
      percentage,
      status
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to submit quiz.', error: error.message });
  }
});

// 4. Get Detailed Review for a Specific Quiz Attempt
router.get('/result/:resultId', verifyToken, isStudent, async (req, res) => {
  try {
    const result = await Result.findById(req.params.resultId)
      .populate('quizId', 'title description category imageUrl')
      .populate('answers.questionId', 'questionText options correctOptionIndex explanation');

    if (!result) {
      return res.status(404).json({ message: 'Result not found.' });
    }

    if (result.studentId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Unauthorized access to this result.' });
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch result details.', error: error.message });
  }
});

// 5. Fetch Full Attempt History for Logged-In Student
router.get('/history', verifyToken, isStudent, async (req, res) => {
  try {
    const history = await Result.find({ studentId: req.user.userId })
      .populate('quizId', 'title category imageUrl')
      .sort({ createdAt: -1 });

    res.json(history);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch attempt history.', error: error.message });
  }
});
// 6. Fetch Student Dashboard Overview Stats (Day 10)
router.get('/dashboard/stats', verifyToken, isStudent, async (req, res) => {
  try {
    const studentId = req.user.userId;

    // Fetch all completed attempts for the current student
    const attempts = await Result.find({ studentId }).populate('quizId', 'title category');

    const totalQuizzesTaken = attempts.length;

    if (totalQuizzesTaken === 0) {
      return res.json({
        totalQuizzesTaken: 0,
        averageScore: 0,
        passedCount: 0,
        failedCount: 0,
        recentAttempts: []
      });
    }

    // Calculate aggregate metrics
    const totalPercentageSum = attempts.reduce((acc, curr) => acc + curr.percentage, 0);
    const averageScore = Math.round(totalPercentageSum / totalQuizzesTaken);

    const passedCount = attempts.filter((item) => item.status === 'Pass').length;
    const failedCount = attempts.filter((item) => item.status === 'Fail').length;

    // Recent 5 attempts for dashboard table/chart
    const recentAttempts = attempts.slice(0, 5).map((attempt) => ({
      resultId: attempt._id,
      quizTitle: attempt.quizId ? attempt.quizId.title : 'Deleted Quiz',
      category: attempt.quizId ? attempt.quizId.category : 'General',
      score: attempt.score,
      totalQuestions: attempt.totalQuestions,
      percentage: attempt.percentage,
      status: attempt.status,
      date: attempt.createdAt
    }));

    res.json({
      totalQuizzesTaken,
      averageScore,
      passedCount,
      failedCount,
      recentAttempts
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch student dashboard stats.', error: error.message });
  }
});

module.exports = router;