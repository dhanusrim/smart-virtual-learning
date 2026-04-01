const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
  title: { type: String, required: true },
  generatedBy: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['System', 'Course', 'Student'], required: true },
  data: { type: mongoose.Schema.Types.Mixed }, // flexible data structure
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Report', ReportSchema);
