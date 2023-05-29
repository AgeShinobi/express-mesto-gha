/* eslint-disable import/no-extraneous-dependencies */
// Packages
const router = require('express').Router();
const { Joi, celebrate } = require('celebrate');

// Controllers
const { createUser } = require('../controllers/users');
// Config
const { LINK_REGEX } = require('../config');

router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(LINK_REGEX),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);

module.exports = router;
