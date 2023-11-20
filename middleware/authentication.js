const CustomError = require("../errors");
const { verifyJWT } = require("../utils");

const authenticateUser = async (req, res, next) => {
  const token = req.signedCookies.token;
  try {
    const { userId, name, role } = await verifyJWT({ token });

    req.user = { userId, name, role };

    next();
  } catch (error) {
    throw new CustomError.UnauthenticatedError("Authenticationn failed");
  }
};

const authorizeUser = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new CustomError.UnauthorizedError("No access for this route");
    }
    next();
  };
};

module.exports = { authenticateUser, authorizeUser };
