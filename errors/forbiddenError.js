const { STATUS_FORBIDDEN_ERROR } = require('../config');

class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = STATUS_FORBIDDEN_ERROR;
  }
}

module.exports = ForbiddenError;
