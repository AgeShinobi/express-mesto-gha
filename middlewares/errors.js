// Import Errors
const {
  ValidationError,
  CastError,
  DocumentNotFoundError,
} = require('mongoose').Error;
const AuthorizationError = require('../errors/authorizationError');
const NotFoundError = require('../errors/notFoundError');

// Import Statuses
const {
  STATUS_BAD_REQUEST,
  STATUS_NOT_FOUND,
  STATUS_INTERNAL_SERVER_ERROR,
  DEFAULT_ERROR_MESSAGE,
  STATUS_CONFLICT_ERROR,
} = require('../config');

// Errors Middleware
module.exports = ((err, req, res, next) => {
  if (err instanceof ValidationError) {
    const errorMessage = Object.values(err.errors).map((error) => error.message).join('; ');
    return res.status(STATUS_BAD_REQUEST).json({
      message: `Переданы некорректные данные: ${errorMessage}`,
    });
  }
  if (err instanceof CastError) {
    return res.status(STATUS_BAD_REQUEST).json({
      message: 'Указан некорректный ID',
    });
  }
  if (err instanceof DocumentNotFoundError) {
    return res.status(STATUS_NOT_FOUND).json({
      message: 'Документ с указанным ID не найден',
    });
  }
  if (err instanceof AuthorizationError) {
    return res.status(err.statusCode).json({
      message: err.message,
    });
  }
  if (err instanceof NotFoundError) {
    return res.status(err.statusCode).json({
      message: err.message,
    });
  }
  if (err.code === 11000) {
    return res.status(STATUS_CONFLICT_ERROR).json({
      message: 'Данный email уже зарегистрирован',
    });
  }
  // Иначе отправляем ошибку 500
  res.status(STATUS_INTERNAL_SERVER_ERROR).json({
    message: DEFAULT_ERROR_MESSAGE,
  });
  return next();
});
