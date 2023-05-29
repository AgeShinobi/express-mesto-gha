/* eslint-disable quotes */
const { STATUS_UNAUTHORIZED } = require("../config");

class AuthorizationError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = STATUS_UNAUTHORIZED;
  }
}

module.exports = AuthorizationError;
