const User = require('../models/User');
const Course = require('../models/Course');
const Assessment = require('../models/Assessment');
const Submission = require('../models/Submission');
const Progress = require('../models/Progress');

// @desc    Get dashboard stats
// @route   GET /api/dashboard/stats
// @access  Private
exports.getStats = async (req, res) => {
  try {
    const { role, id } = req.user;
    let stats = {};

    if (role === 'Admin') {
      const usersCount = await User.countDocuments();
      const coursesCount = await Course.countDocuments();
      const studentsCount = await User.countDocuments({ role: 'Student' });
      const facultyCount = await User.countDocuments({ role: 'Faculty' });
      const assessmentsCount = await Assessment.countDocuments();
      const submissionsCount = await Submission.countDocuments();
      
      stats = { 
        totalUsers: usersCount, 
        totalCourses: coursesCount,
        totalStudents: studentsCount,
        totalFaculty: facultyCount,
        totalAssessments: assessmentsCount,
        totalSubmissions: submissionsCount
      };
    } else if (role === 'Faculty') {
      const coursesCount = await Course.countDocuments({ faculty: id });
      const assessmentsCount = await Assessment.countDocuments({ faculty: id });
      stats = { myCourses: coursesCount, myAssessments: assessmentsCount };
    } else if (role === 'Student') {
      const enroledCourses = await Course.countDocuments({ students: id });
      const completedAssessments = await Submission.countDocuments({ student: id });
      
      let overallProgress = 0;
      const progressDocs = await Progress.find({ student: id });
      if (progressDocs && progressDocs.length > 0) {
          const total = progressDocs.reduce((acc, p) => acc + (p.completionPercentage || 0), 0);
          overallProgress = Math.round(total / progressDocs.length);
      }
      
      stats = { 
          enrolledCourses: enroledCourses, 
          completedAssessments: completedAssessments, 
          overallProgress: overallProgress 
      };
    }

    res.status(200).json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
