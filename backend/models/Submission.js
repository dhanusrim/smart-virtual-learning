const mongoose = require('mongoose');

const SubmissionSchema = new mongoose.Schema({
  assessment: { type: mongoose.Schema.ObjectId, ref: 'Assessment', required: true },
  student: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
  answers: [{
    questionId: { type: mongoose.Schema.ObjectId },
    answerText: { type: String }
  }],
  score: { type: Number },
  feedback: { type: String },
  evaluated: { type: Boolean, default: false },
  submittedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Submission', SubmissionSchema);
