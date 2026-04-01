const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  targetAudience: { type: String, default: 'All Students' },
  targetCourse: { type: String, default: 'All Courses' },
  course: { type: mongoose.Schema.ObjectId, ref: 'Course' },
  recipient: { type: mongoose.Schema.ObjectId, ref: 'User' },
  targetAudienceDetails: { type: String },
  targetCourseDetails: { type: String },
  readBy: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now },
  // Legacy support
  target: { type: String },
  targetDetails: { type: String }
});

module.exports = mongoose.model('Notification', NotificationSchema);
