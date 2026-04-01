const express = require('express');
const { getReports, generateReport } = require('../controllers/reportController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);
router.use(authorize('Faculty', 'Admin'));

router.route('/')
  .get(getReports)
  .post(generateReport);

module.exports = router;
