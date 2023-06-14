const Card = require('../models/cards');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(() => {
      const ERROR_CODE = 500;

      res.status(ERROR_CODE).send('Ошибка при получении карточек, на сервере произошла ошибка');
    });
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const ERROR_CODE = 400;

        res.status(ERROR_CODE).send('Данные для создания карточки переданы неверно');
      }

      const ERROR_CODE = 500;

      res.status(ERROR_CODE).send('Ошибка при создании карточки, на сервере произошла ошибка');
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        const ERROR_CODE = 404;

        res.status(ERROR_CODE).send('Карточка с указанным id не найдена');
      }

      const ERROR_CODE = 500;

      res.status(ERROR_CODE).send('Ошибка при удалении карточки, на сервере произошла ошибка');
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((likes) => res.send(likes))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const ERROR_CODE = 400;

        res.status(ERROR_CODE).send('Данные для лайка карточки переданы неверно');
      }

      if (err.name === 'CastError') {
        const ERROR_CODE = 404;

        res.status(ERROR_CODE).send('Карточка с указанным id не найдена');
      }

      const ERROR_CODE = 500;

      res.status(ERROR_CODE).send('Ошибка при лайке карточки, на сервере произошла ошибка');
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((likes) => res.send(likes))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const ERROR_CODE = 400;

        res.status(ERROR_CODE).send('Данные для дизлайка карточки переданы неверно');
      }

      if (err.name === 'CastError') {
        const ERROR_CODE = 404;

        res.status(ERROR_CODE).send('Карточка с указанным id не найдена');
      }

      const ERROR_CODE = 500;

      res.status(ERROR_CODE).send('Ошибка при дизлайке карточки, на сервере произошла ошибка');
    });
};
