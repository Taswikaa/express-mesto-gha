const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
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
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  bcryptjs.hash(password, 10)
    .then((hash) => {
      User.create(
        {
          name,
          about,
          avatar,
          email,
          password: hash,
        },
      )
        .then((user) => res.status(201).send({ data: user }))
        .catch((err) => {
          if (err.name === 'ValidationError') {
            const ERROR_CODE = 400;

            res.status(ERROR_CODE).send({ message: 'Данные для создания пользователя переданы неверно' });

            return;
          }

          const ERROR_CODE = 500;

          res.status(ERROR_CODE).send({ message: 'Ошибка при создании пользователя, на сервере произошла ошибка' });
        });
    });
};

module.exports.getCurrentUser = (req, res) => {
  User.findById(req.user._id)
    .then((user) => res.send(user))
    .catch(() => res.status(404).send('Не тот id'));
};

module.exports.updateUserInfo = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const ERROR_CODE = 400;

        res.status(ERROR_CODE).send({ message: 'Данные для изменения информации о пользователе переданы неверно' });

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

      const ERROR_CODE = 500;

      res.status(ERROR_CODE).send({ message: 'Ошибка при изменении информации о пользователе, на сервере произошла ошибка' });
    });
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  return User.findUser(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'c0e93f2d3d88bacea4c540ff0c6a64c12bfebbfe78d0f77b41e85975521d9437', {
        expiresIn: '1d',
      });

      res.cookie('jwt', token, {
        maxAge: 20,
        httpOnly: true,
      });

      res.send(token);
    })
    .catch((err) => {
      const ERROR_CODE = 401;

      res.status(ERROR_CODE).send({ message: err.message });
    });
};
