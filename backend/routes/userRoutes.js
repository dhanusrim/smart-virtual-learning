const express = require('express');
const { getUsers, getUser, createUser, updateUser, deleteUser, getStudents } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/students', authorize('Admin', 'Faculty'), getStudents);

router.use(authorize('Admin'));

router.route('/')
  .get(getUsers)
  .post(createUser);

router.route('/:id')
  .get(getUser)
  .put(updateUser)
  .delete(deleteUser);

module.exports = router;
