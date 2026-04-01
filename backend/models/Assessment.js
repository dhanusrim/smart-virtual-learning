const mongoose = require('mongoose');

const AssessmentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  course: { type: mongoose.Schema.ObjectId, ref: 'Course', required: true },
  faculty: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['MCQ', 'Text'], required: true },
  questions: [{
    questionText: { type: String, required: true },
    options: [{ type: String }], // Only for MCQ
    correctAnswer: { type: String } // Applies to both, but mostly MCQ
  }],
  dueDate: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Assessment', AssessmentSchema);
