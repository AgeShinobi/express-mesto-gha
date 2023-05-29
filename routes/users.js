/* eslint-disable import/no-extraneous-dependencies */
const router = require('express').Router();
const { Joi, celebrate } = require('celebrate');
const { LINK_REGEX } = require('../config');

const {
  getUsers,
  getMyInfo,
  getUser,
  updateUserInfo,
  updateAvatar,
} = require('../controllers/users');

// Get all users
router.get('/', getUsers);

// Find user with UserId
router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().hex().length(24),
  }),
}), getUser);

// Get my info
router.get('/me', getMyInfo);

// Update 'name' & 'about'
router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateUserInfo);

// Update 'avatar'
router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().regex(LINK_REGEX),
  }),
}), updateAvatar);

module.exports = router;
