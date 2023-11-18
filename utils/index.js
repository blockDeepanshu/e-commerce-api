const { generateJWT, verifyJWT, attachCookiesToResponse } = require("./token");

module.exports = {
  generateJWT,
  verifyJWT,
  attachCookiesToResponse,
};
