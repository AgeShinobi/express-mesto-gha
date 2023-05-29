/* eslint-disable import/no-extraneous-dependencies */
// Packages
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Models
const User = require('../models/user');

// Config
const {
  STATUS_CREATED,
} = require('../config');

// Get all users
const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      res.send({ data: users });
    })
    .catch(next);
};

// Общий метод для поиска пользователя по ID
const findUserById = (req, res, data, next) => {
  User.findById(data)
    .orFail(() => {
    })
    .then((user) => res.send(user))
    .catch(next);
};

// Get my info ( route - /me )
const getMyInfo = (req, res, next) => {
  const data = req.user._id;
  findUserById(req, res, data, next);
};

// Get user by userId
const getUser = (req, res, next) => {
  const data = req.params.userId;
  findUserById(req, res, data, next);
};

// Create user
const createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => {
      const data = user.toObject();
      delete data.password;
      res
        .status(STATUS_CREATED)
        .send(data);
    })
    .catch(next);
};

// Update user info
const updateUserInfo = (req, res, next) => {
  const id = req.user._id;
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    id,
    { name, about },
    { new: true, runValidators: true },
  )
    .orFail()
    .then((user) => {
      res.send({ user });
    })
    .catch(next);
};

// Update avatar info
const updateAvatar = (req, res, next) => {
  const id = req.user._id;
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    id,
    { avatar },
    { new: true, runValidators: true },
  )
    .orFail()
    .then((user) => {
      res.send({ user });
    })
    .catch(next);
};

// Login
const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'super-strong-password', { expiresIn: '7d' });
      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
        sameSite: true,
      });
      res.send({ message: 'Вход выполнен успешно' });
    })
    .catch(next);
};

// Exports
module.exports = {
  getUsers,
  getMyInfo,
  getUser,
  createUser,
  updateUserInfo,
  updateAvatar,
  login,
};
