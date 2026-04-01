const express = require('express');
const { getProgress, updateProgress } = require('../controllers/progressController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.post('/update', authorize('Student'), updateProgress);

router.route('/:courseId')
  .get(getProgress)
  .put(authorize('Student'), updateProgress);

module.exports = router;
