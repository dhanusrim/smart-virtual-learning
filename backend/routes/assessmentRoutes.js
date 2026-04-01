const express = require('express');
const { getAssessments, createAssessment, updateAssessment, deleteAssessment, submitAssessment, getSubmissions, evaluateSubmission } = require('../controllers/assessmentController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/course/:courseId', getAssessments);
router.post('/', authorize('Faculty', 'Admin'), createAssessment);

// Added Edit and Delete routes for Assessments
router.route('/:id')
  .put(authorize('Faculty', 'Admin'), updateAssessment)
  .delete(authorize('Faculty', 'Admin'), deleteAssessment);

router.post('/:id/submit', authorize('Student'), submitAssessment);
router.get('/:id/submissions', authorize('Faculty', 'Admin'), getSubmissions);
router.put('/submissions/:id', authorize('Faculty', 'Admin'), evaluateSubmission);

module.exports = router;
