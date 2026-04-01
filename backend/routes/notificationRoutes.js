const express = require('express');
const { getNotifications, markAsRead, createNotification, deleteNotification } = require('../controllers/notificationController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getNotifications)
  .post(authorize('Faculty', 'Admin'), createNotification);

router.route('/:id')
  .delete(authorize('Faculty', 'Admin'), deleteNotification);

router.put('/:id/read', markAsRead);

module.exports = router;
