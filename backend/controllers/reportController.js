const Report = require('../models/Report');
const Progress = require('../models/Progress');
const Course = require('../models/Course');
const User = require('../models/User');

// @desc    Get all reports / Generate system report
// @route   GET /api/reports
// @access  Private/Faculty/Admin
exports.getReports = async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'Faculty') {
      query.generatedBy = req.user.id;
    }
    const reports = await Report.find(query).sort('-createdAt');
    res.status(200).json({ success: true, count: reports.length, data: reports });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Generate a report
// @route   POST /api/reports
// @access  Private/Faculty/Admin
exports.generateReport = async (req, res) => {
  try {
    const { title, type, courseId } = req.body;
    let data = [];

    if (type === 'System' && req.user.role === 'Admin') {
      const totalUsers = await User.countDocuments();
      const totalCourses = await Course.countDocuments();
      data = [{ Metric: 'Total Users', Value: totalUsers }, { Metric: 'Total Courses', Value: totalCourses }];
    } else if (type === 'Course' && courseId) {
      const course = await Course.findById(courseId).populate('students', 'name email');
      if (course) {
          const progressRecords = await Progress.find({ course: courseId }).populate('student', 'name email');
          
          data = progressRecords.map(p => ({
              studentName: p.student?.name || 'Unknown',
              email: p.student?.email || 'N/A',
              course: course.title,
              completedContent: p.completedContent.length,
              completedAssessments: p.completedAssessments.length,
              progressPercent: p.completionPercentage,
              lastAccessed: p.lastAccessed
          }));
      }
    } else {
        return res.status(400).json({ success: false, message: 'Invalid report parameters' });
    }

    const report = await Report.create({
      title,
      type,
      data,
      generatedBy: req.user.id
    });

    res.status(201).json({ success: true, data: report });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
