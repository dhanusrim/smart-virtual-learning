const express = require('express');
const { getCourses, getCourse, createCourse, updateCourse, deleteCourse, enrollCourse, getEnrolledCourses } = require('../controllers/courseController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getCourses)
  .post(authorize('Faculty', 'Admin'), createCourse);

router.get('/enrolled', authorize('Student'), getEnrolledCourses);

router.route('/:id')
  .get(getCourse)
  .put(authorize('Faculty', 'Admin'), updateCourse)
  .delete(authorize('Faculty', 'Admin'), deleteCourse);

router.post('/:id/enroll', authorize('Student'), enrollCourse);

module.exports = router;
