const Progress = require('../models/Progress');
const Course = require('../models/Course');
const Content = require('../models/Content');
const Assessment = require('../models/Assessment');

// @desc    Get progress for a course
// @route   GET /api/progress/:courseId
// @access  Private
exports.getProgress = async (req, res) => {
  try {
    if (req.user.role !== 'Student') {
       // Faculty/Admin sees ALL students progress for the course
       const allProgress = await Progress.find({ course: req.params.courseId }).populate('student', 'name email');
       return res.status(200).json({ success: true, data: allProgress });
    }

    // Student sees their own progress
    let progress = await Progress.findOne({ course: req.params.courseId, student: req.user.id });
    if (!progress) {
      progress = await Progress.create({ course: req.params.courseId, student: req.user.id });
    }
    res.status(200).json({ success: true, data: progress });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update progress
// @route   PUT /api/progress/:courseId
// @route   POST /api/progress/update
// @access  Private/Student
exports.updateProgress = async (req, res) => {
  try {
    const { contentId, assessmentId, courseId } = req.body;
    const courseIdToUse = req.params.courseId || courseId;

    if (!courseIdToUse) {
      return res.status(400).json({ success: false, message: "Course ID is required" });
    }

    let progress = await Progress.findOne({ course: courseIdToUse, student: req.user.id });
    
    if (!progress) {
      progress = new Progress({ course: courseIdToUse, student: req.user.id });
    }

    if (contentId && !progress.completedContent.includes(contentId)) {
      progress.completedContent.push(contentId);
    }
    if (assessmentId && !progress.completedAssessments.includes(assessmentId)) {
      progress.completedAssessments.push(assessmentId);
    }

    const totalContent = await Content.countDocuments({ course: courseIdToUse });
    const totalAssessments = await Assessment.countDocuments({ course: courseIdToUse });
    const totalItems = totalContent + totalAssessments;

    if (totalItems > 0) {
      const completedItems = progress.completedContent.length + progress.completedAssessments.length;
      progress.completionPercentage = Math.round((completedItems / totalItems) * 100);
    }

    progress.lastAccessed = Date.now();
    await progress.save();

    res.status(200).json({ success: true, data: progress });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
