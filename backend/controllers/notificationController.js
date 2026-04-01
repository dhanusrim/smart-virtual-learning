const Notification = require('../models/Notification');
const User = require('../models/User');
const Course = require('../models/Course');

// @desc    Get notifications
// @route   GET /api/notifications
// @access  Private
exports.getNotifications = async (req, res) => {
  try {
    let notifications = [];
    if (req.user.role === 'Student') {
       // Get enrolled courses
       const courses = await Course.find({ students: req.user.id }).select('_id');
       const courseIds = courses.map(c => c._id);

       notifications = await Notification.find({
           $and: [
               {
                   $or: [
                       { targetAudience: 'All Students' },
                       { targetAudience: 'Specific Student', recipient: req.user.id },
                       // Legacy support
                       { target: 'All Students' },
                       { target: 'Course', course: { $in: courseIds } },
                       { target: 'Specific Course', course: { $in: courseIds } },
                       { target: 'Student', recipient: req.user.id },
                       { target: 'Specific Student', recipient: req.user.id }
                   ]
               },
               {
                   $or: [
                       { targetCourse: 'All Courses' },
                       { targetCourse: 'Specific Course', course: { $in: courseIds } },
                       { targetCourse: { $exists: false } } // For legacy notifications
                   ]
               }
           ]
       }).sort('-createdAt');
    } else {
       notifications = await Notification.find({ sender: req.user.id }).sort('-createdAt');
    }
    
    // Formatting read status for the current user
    const data = notifications.map(n => {
        const doc = n.toObject();
        doc.read = doc.readBy && doc.readBy.some(id => id.toString() === req.user.id);
        return doc;
    });

    res.status(200).json({ success: true, count: data.length, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Mark as read
// @route   PUT /api/notifications/:id/read
// @access  Private
exports.markAsRead = async (req, res) => {
  try {
    let notification = await Notification.findById(req.params.id);
    if (!notification) return res.status(404).json({ success: false, message: 'Not found' });
    
    // Add user to readBy array if not already there
    if (!notification.readBy.includes(req.user.id)) {
        notification.readBy.push(req.user.id);
        await notification.save();
    }
    
    const doc = notification.toObject();
    doc.read = true;
    res.status(200).json({ success: true, data: doc });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete notification
// @route   DELETE /api/notifications/:id
// @access  Private/Faculty
exports.deleteNotification = async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id);
        if(!notification) return res.status(404).json({ success: false, message: 'Not found' });
        
        if (notification.sender?.toString() !== req.user.id && req.user.role !== 'Admin') {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }
        await notification.deleteOne();
        res.status(200).json({ success: true, data: {} });
    } catch(err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Create notification
// @route   POST /api/notifications
// @access  Private/Faculty/Admin
exports.createNotification = async (req, res) => {
  try {
    const { title, message, targetAudience, targetCourse, courseId, studentId } = req.body;
    let targetAudienceDetails = targetAudience || 'All Students';
    let targetCourseDetails = targetCourse || 'All Courses';

    if (targetCourse === 'Specific Course' && courseId) {
        const course = await Course.findById(courseId);
        if (course) targetCourseDetails = course.title;
    } 
    if (targetAudience === 'Specific Student' && studentId) {
        const student = await User.findById(studentId);
        if (student) targetAudienceDetails = student.name;
    }

    const notification = await Notification.create({
        sender: req.user.id,
        title,
        message,
        targetAudience,
        targetCourse,
        course: targetCourse === 'Specific Course' ? courseId : null,
        recipient: targetAudience === 'Specific Student' ? studentId : null,
        targetAudienceDetails,
        targetCourseDetails
    });

    res.status(201).json({ success: true, data: notification });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
