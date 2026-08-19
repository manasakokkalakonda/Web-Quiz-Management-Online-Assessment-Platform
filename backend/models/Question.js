// backend/models/Question.js
const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema(
  {
    quizId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Quiz',
      required: true
    },
    questionText: {
      type: String,
      required: true,
      trim: true
    },
    options: [
      {
        type: String,
        required: true
      }
    ],
    correctOptionIndex: {
      type: Number,
      required: true // e.g., 0 for Option A, 1 for Option B
    },
    explanation: {
      type: String,
      default: ''
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Question', questionSchema);