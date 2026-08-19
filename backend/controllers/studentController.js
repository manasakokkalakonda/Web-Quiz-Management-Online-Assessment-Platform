const Result = require('../models/Result');
const Quiz = require('../models/Quiz');

// @desc    Submit quiz answers and evaluate score
// @route   POST /api/student/submit-quiz
exports.submitQuiz = async (req, res) => {
  try {
    const { quizId, answers, timeSpent } = req.body; // answers: [{ questionId, selectedIndex }]
    const studentId = req.user.userId;

    const quiz = await Quiz.findById(quizId).populate('questions');
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    let score = 0;
    const evaluatedAnswers = quiz.questions.map((q) => {
      const studentAnswer = answers.find((a) => a.questionId.toString() === q._id.toString());
      const isCorrect = studentAnswer && studentAnswer.selectedIndex === q.correctAnswerIndex;
      if (isCorrect) score += 1;

      return {
        questionId: q._id,
        selectedOption: studentAnswer ? studentAnswer.selectedIndex : null,
        isCorrect
      };
    });

    const totalQuestions = quiz.questions.length;
    const percentage = Math.round((score / totalQuestions) * 100);
    const passed = percentage >= quiz.passPercentage;

    const result = new Result({
      student: studentId,
      quiz: quizId,
      score,
      totalQuestions,
      percentage,
      passed,
      timeSpent,
      answersDetails: evaluatedAnswers
    });

    await result.save();
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get current student's attempt history & stats
// @route   GET /api/student/dashboard
exports.getStudentStats = async (req, res) => {
  try {
    const results = await Result.find({ student: req.user.userId }).populate('quiz', 'title category');
    
    const totalAttempts = results.length;
    const averageScore = totalAttempts > 0 
      ? (results.reduce((acc, curr) => acc + curr.percentage, 0) / totalAttempts).toFixed(2)
      : 0;

    res.json({ totalAttempts, averageScore, attempts: results });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};