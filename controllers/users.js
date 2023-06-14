const User = require('../models/users');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => {
      const ERROR_CODE = 500;

      res.status(ERROR_CODE).send('Ошибка при получение пользователей, на сервере произошла ошибка');
    });
};

module.exports.getUser = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        const ERROR_CODE = 404;

        res.status(ERROR_CODE).send('Пользователя с таким id не существует');
      }

      const ERROR_CODE = 500;

      res.status(ERROR_CODE).send('Ошибка при получении пользователя, на сервере произошла ошибка');
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const ERROR_CODE = 400;

        res.status(ERROR_CODE).send('Данные для создания пользователя переданы неверно');
      }

      const ERROR_CODE = 500;

      res.status(ERROR_CODE).send('Ошибка при создании пользователя, на сервере произошла ошибка');
    });
};

module.exports.updateUserInfo = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
    },
  )
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const ERROR_CODE = 400;

        res.status(ERROR_CODE).send('Данные для изменения информации о пользователе переданы неверно');
      }

      if (err.name === 'CastError') {
        const ERROR_CODE = 404;

        res.status(ERROR_CODE).send('Пользователя с таким id не существует');
      }

      const ERROR_CODE = 500;

      res.status(ERROR_CODE).send('Ошибка при изменении информации о пользователе, на сервере произошла ошибка');
    });
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
    },
  )
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const ERROR_CODE = 400;

        res.status(ERROR_CODE).send('Данные для изменения информации о пользователе переданы неверно');
      }

      if (err.name === 'CastError') {
        const ERROR_CODE = 404;

        res.status(ERROR_CODE).send('Пользователя с таким id не существует');
      }

      const ERROR_CODE = 500;

      res.status(ERROR_CODE).send('Ошибка при изменении информации о пользователе, на сервере произошла ошибка');
    });
};
