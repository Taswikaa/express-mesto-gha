const Card = require('../models/cards');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(() => {
      const ERROR_CODE = 500;

      res.status(ERROR_CODE).send({ message: 'Ошибка при получении карточек, на сервере произошла ошибка' });
    });
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const ERROR_CODE = 400;

        res.status(ERROR_CODE).send({ message: 'Данные для создания карточки переданы неверно' });

        return;
      }

      const ERROR_CODE = 500;

      res.status(ERROR_CODE).send({ message: 'Ошибка при создании карточки, на сервере произошла ошибка' });
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        const ERROR_CODE = 404;

        res.status(ERROR_CODE).send({ message: 'Карточка с указанным id не найдена' });

        return;
      }

      const ERROR_CODE = 500;

      res.status(ERROR_CODE).send({ message: 'Ошибка при удалении карточки, на сервере произошла ошибка' });
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((likes) => {
      if (likes) {
        res.send(likes);
      } else {
        const ERROR_CODE = 404;

        res.status(ERROR_CODE).send({ message: 'Данные для лайка карточки переданы неверно' });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        const ERROR_CODE = 400;

        res.status(ERROR_CODE).send({ message: 'Карточка с указанным id не найдена' });

        return;
      }

      const ERROR_CODE = 500;

      res.status(ERROR_CODE).send({ message: 'Ошибка при лайке карточки, на сервере произошла ошибка' });
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((likes) => {
      if (likes) {
        res.send(likes);
      } else {
        const ERROR_CODE = 400;

        res.status(ERROR_CODE).send({ message: 'Данные для дизлайка карточки переданы неверно' });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        const ERROR_CODE = 400;

        res.status(ERROR_CODE).send({ message: 'Карточка с указанным id не найдена' });

        return;
      }

      const ERROR_CODE = 500;

      res.status(ERROR_CODE).send({ message: 'Ошибка при дизлайке карточки, на сервере произошла ошибка' });
    });
};
