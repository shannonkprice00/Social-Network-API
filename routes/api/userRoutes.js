const router = require('express').Router();
const {
  getUsers,
  getSingleUser,
  createUser,
  deleteSingleUser,
  updateSingleUser,
  createFriend,
  deleteFriend,
} = require('../../controllers/userController');

// /api/users
router.route('/').get(getUsers).post(createUser);

// /api/users/:userId
router.route('/:userId').get(getSingleUser).put(updateSingleUser).delete(deleteSingleUser);

// /api/users/:userId/friend/:friendId
router.route('/:userId/friend/:friendId').post(createFriend).delete(deleteFriend);

module.exports = router;