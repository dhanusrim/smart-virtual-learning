const mongoose = require('mongoose');

const ContentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  contentType: { type: String, enum: ['Video', 'Document', 'Link', 'YouTube', 'youtube', 'video', 'document'], required: true },
  url: { type: String, required: true }, // URL of the uploaded file or external link
  course: { type: mongoose.Schema.ObjectId, ref: 'Course', required: true },
  faculty: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Content', ContentSchema);
