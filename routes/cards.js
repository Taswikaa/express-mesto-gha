const { isObjectIdOrHexString } = require('mongoose');
const { celebrate, Joi } = require('celebrate');
const router = require('express').Router();
const auth = require('../middlewares/auth');
const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

const checkId = (value) => {
  if (!isObjectIdOrHexString(value)) {
    throw new Error(`${value} is not card id`);
  }
  return value;
};

router.get('/cards', auth, getCards);

router.post('/cards', auth, celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(/^https?:\/\/(w{3}\.)?[a-z1-9-._~:/?#@!$&'()*+,;[\]=]+#?$/),
  }),
}), createCard);

router.delete('/cards/:cardId', auth, celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().custom(checkId),
  }),
}), deleteCard);

router.put('/cards/:cardId/likes', auth, celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().custom(checkId),
  }),
}), likeCard);

router.delete('/cards/:cardId/likes', auth, celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().custom(checkId),
  }),
}), dislikeCard);

module.exports = router;
