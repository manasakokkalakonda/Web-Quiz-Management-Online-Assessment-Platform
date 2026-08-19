// backend/models/Result.js
const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    quizId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Quiz',
      required: true
    },
    answers: [
      {
        questionId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Question',
          required: true
        },
        selectedOptionIndex: {
          type: Number,
          default: -1 // -1 means skipped/unanswered
        },
        isCorrect: {
          type: Boolean,
          required: true
        }
      }
    ],
    score: {
      type: Number,
      required: true
    },
    totalQuestions: {
      type: Number,
      required: true
    },
    percentage: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: ['Pass', 'Fail'],
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Result', resultSchema);