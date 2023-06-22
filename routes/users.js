const { isObjectIdOrHexString } = require('mongoose');
const { celebrate, Joi } = require('celebrate');
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

const checkId = (value) => {
  if (!isObjectIdOrHexString(value)) {
    throw new Error(`${value} is not user id`);
  }
  return value;
};

router.get('/users', auth, getUsers);

router.get('/users/me', auth, getCurrentUser);

router.get('/users/:userId', auth, celebrate({
  params: Joi.object().keys({
    userId: Joi.string().custom(checkId),
  }),
}), getUser);

router.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(/^https?:\/\/(w{3}\.)?[a-z1-9-._~:/?#@!$&'()*+,;[\]=]+#?$/),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
}), createUser);

router.patch('/users/me', auth, celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateUserInfo);

router.patch('/users/me/avatar', auth, celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(/^https?:\/\/(w{3}\.)?[a-z1-9-._~:/?#@!$&'()*+,;[\]=]+#?$/),
  }),
}), updateUserAvatar);

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
}), login);

module.exports = router;
