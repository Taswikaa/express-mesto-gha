const User = require('../models/users');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => {
      const ERROR_CODE = 500;

      res.status(ERROR_CODE).send({ message: 'Ошибка при получение пользователей, на сервере произошла ошибка' });
    });
};

module.exports.getUser = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (user) {
        res.send(user);
      } else {
        const ERROR_CODE = 404;

        res.status(ERROR_CODE).send({ message: 'Пользователя с таким id не существует' });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        const ERROR_CODE = 400;

        res.status(ERROR_CODE).send({ message: 'Пользователя с таким id не существует' });

        return;
      }

      const ERROR_CODE = 500;

      res.status(ERROR_CODE).send({ message: 'Ошибка при получении пользователя, на сервере произошла ошибка' });
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const ERROR_CODE = 400;

        res.status(ERROR_CODE).send({ message: 'Данные для создания пользователя переданы неверно' });

        return;
      }

      const ERROR_CODE = 500;

      res.status(ERROR_CODE).send({ message: 'Ошибка при создании пользователя, на сервере произошла ошибка' });
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
    .then((user) => {
      if (name.length > 1 && name.length < 31 && about.length > 1 && about.length < 31) {
        res.send({ data: user });
      } else {
        const ERROR_CODE = 400;

        res.status(ERROR_CODE).send({ message: 'Данные для изменения информации о пользователе переданы неверно' });
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const ERROR_CODE = 400;

        res.status(ERROR_CODE).send({ message: 'Данные для изменения информации о пользователе переданы неверно' });

        return;
      }

      if (err.name === 'CastError') {
        const ERROR_CODE = 404;

        res.status(ERROR_CODE).send({ message: 'Пользователя с таким id не существует' });

        return;
      }

      const ERROR_CODE = 500;

      res.status(ERROR_CODE).send({ message: 'Ошибка при изменении информации о пользователе, на сервере произошла ошибка' });
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

        res.status(ERROR_CODE).send({ message: 'Данные для изменения информации о пользователе переданы неверно' });

        return;
      }

      if (err.name === 'CastError') {
        const ERROR_CODE = 404;

        res.status(ERROR_CODE).send({ message: 'Пользователя с таким id не существует' });

        return;
      }

      const ERROR_CODE = 500;

      res.status(ERROR_CODE).send({ message: 'Ошибка при изменении информации о пользователе, на сервере произошла ошибка' });
    });
};
