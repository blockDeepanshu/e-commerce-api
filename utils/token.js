const jwt = require("jsonwebtoken");

const generateJWT = async ({ payload }) => {
  const token = await jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_TIMELINE,
  });

  return token;
};

const verifyJWT = async ({ token }) => {
  const isMatch = await jwt.verify(token, process.env.JWT_SECRET);
  return isMatch;
};

const attachCookiesToResponse = async ({ res, user }) => {
  const token = await generateJWT({ payload: user });

  const oneDay = 1000 * 60 * 60 * 24;

  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    secure: process.env.NODE_ENV === "production",
    signed: true,
  });
};

module.exports = {
  generateJWT,
  verifyJWT,
  attachCookiesToResponse,
};
