const Card = require('../models/cards');
const NotFoundError = require('../errors/not-found-error');
const BadRequestError = require('../errors/bad-request-error');
const ForbiddenError = require('../errors/forbidden-error');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send(card))
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (card) {
        if (!(req.user._id === card.owner._id.toString())) {
          throw new ForbiddenError('Нельзя удалять чужие карточки');
        }

        Card.findByIdAndRemove(req.params.cardId)
          .then((deletedCard) => res.send(deletedCard))
          .catch(next);
      } else {
        throw new NotFoundError('Карточка с указанным id не найдена');
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Карточка с указанным id не найдена'));
      }

      return next(err);
    });
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((likes) => {
      if (!likes) {
        throw new NotFoundError('Данные для лайка карточки переданы неверно');
      }
      res.send(likes);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Карточка с указанным id не найдена'));
      }

      return next(err);
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((likes) => {
      if (!likes) {
        throw new NotFoundError('Данные для лайка карточки переданы неверно');
      }
      res.send(likes);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Карточка с указанным id не найдена'));
      }

      return next(err);
    });
};
