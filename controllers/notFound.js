// Import Error
const NotFoundError = require('../errors/notFoundError');

// Controller
const notFound = (req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
};

// Export
module.exports = {
  notFound,
};
