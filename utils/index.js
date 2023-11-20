const { generateJWT, verifyJWT, attachCookiesToResponse } = require("./token");
const { createTokenUser } = require("./createTokenUser");
const checkPermission = require("./checkPermission");

module.exports = {
  generateJWT,
  verifyJWT,
  attachCookiesToResponse,
  createTokenUser,
  checkPermission,
};
