const router = require('express').Router();
const auth = require('../middlewares/auth');
const {
  getUsers,
  getUser,
  createUser,
  updateUserInfo,
  updateUserAvatar,
  login,
  getCurrentUser,
} = require('../controllers/users');

router.get('/users', auth, getUsers);

router.get('/users/me', auth, getCurrentUser);

router.get('/users/:userId', auth, getUser);

router.post('/signup', createUser);

router.patch('/users/me', auth, updateUserInfo);

router.patch('/users/me/avatar', auth, updateUserAvatar);

router.post('/signin', login);

module.exports = router;
