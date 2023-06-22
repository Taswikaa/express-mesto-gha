const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/users');
const BadRequestError = require('../errors/bad-request-error');
const ConflictError = require('../errors/conflict-error');
const UnauthorizedError = require('../errors/unauthorized-error');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      if (!users) {
        throw new Error();
      }
      res.send({ data: users });
    })
    .catch(next);
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      res.send(user);
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
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
            throw new BadRequestError('Данные для создания пользователя переданы неверно');
          }

          if (err.code === 11000) {
            throw new ConflictError('Этот адрес уже исползуется');
          }
        })
        .catch(next);
    })
    .catch(next);
};

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => res.send(user))
    .catch(next);
};

module.exports.updateUserInfo = (req, res, next) => {
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
    .catch(() => {
      throw new BadRequestError('Данные для изменения информации о пользователе переданы неверно');
    })
    .catch(next);
};

module.exports.updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => res.send({ data: user }))
    .catch(() => {
      throw new BadRequestError('Данные для изменения информации о пользователе переданы неверно');
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUser(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'c0e93f2d3d88bacea4c540ff0c6a64c12bfebbfe78d0f77b41e85975521d9437', {
        expiresIn: '7d',
      });

      res.cookie('jwt', token, {
        maxAge: 3600,
        httpOnly: true,
      });

      res.send({ jwt: token });
    })
    .catch((err) => {
      throw new UnauthorizedError(err.message);
    })
    .catch(next);
};
