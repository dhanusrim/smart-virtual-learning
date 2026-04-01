const mongoose = require('mongoose');

const ProgressSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
  course: { type: mongoose.Schema.ObjectId, ref: 'Course', required: true },
  completedContent: [{ type: mongoose.Schema.ObjectId, ref: 'Content' }],
  completedAssessments: [{ type: mongoose.Schema.ObjectId, ref: 'Assessment' }],
  completionPercentage: { type: Number, default: 0 },
  lastAccessed: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Progress', ProgressSchema);
