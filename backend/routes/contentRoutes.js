const express = require('express');
const { getCourseContent, addContent, updateContent, deleteContent } = require('../controllers/contentController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

router.use(protect);

router.get('/course/:courseId', getCourseContent);

router.route('/')
  .post(authorize('Faculty', 'Admin'), upload.single('file'), addContent);

router.route('/:id')
  .put(authorize('Faculty', 'Admin'), upload.single('file'), updateContent)
  .delete(authorize('Faculty', 'Admin'), deleteContent);

module.exports = router;
