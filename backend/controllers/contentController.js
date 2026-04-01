const Content = require('../models/Content');

// @desc    Get content for a course
// @route   GET /api/content/course/:courseId
// @access  Private
exports.getCourseContent = async (req, res) => {
  try {
    const contents = await Content.find({ course: req.params.courseId });
    res.status(200).json({ success: true, count: contents.length, data: contents });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add content to a course
// @route   POST /api/content
// @access  Private/Faculty
exports.addContent = async (req, res) => {
  try {
    req.body.faculty = req.user.id;
    
    // Handle File Upload
    if (req.file) {
        req.body.url = `/uploads/${req.file.filename}`;
    }

    const content = await Content.create(req.body);
    res.status(201).json({ success: true, data: content });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update content
// @route   PUT /api/content/:id
// @access  Private/Faculty
exports.updateContent = async (req, res) => {
  try {
    let content = await Content.findById(req.params.id);
    if (!content) {
      return res.status(404).json({ success: false, message: 'Content not found' });
    }
    if (content.faculty.toString() !== req.user.id && req.user.role !== 'Admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    
    if (req.file) {
        req.body.url = `/uploads/${req.file.filename}`;
    }

    content = await Content.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.status(200).json({ success: true, data: content });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete content
// @route   DELETE /api/content/:id
// @access  Private/Faculty
exports.deleteContent = async (req, res) => {
  try {
    const content = await Content.findById(req.params.id);
    if (!content) {
      return res.status(404).json({ success: false, message: 'Content not found' });
    }
    if (content.faculty.toString() !== req.user.id && req.user.role !== 'Admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    await content.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
