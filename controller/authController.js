const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");

const JWT = require("../utils");

// Register a new User
const register = async (req, res) => {
  const { name, email, password } = req.body;

  const isEmailAlreadyExists = await User.findOne({ email });
  if (isEmailAlreadyExists) {
    throw new CustomError.BadRequestError("Email already exists");
  }
  const isFirstUser = (await User.countDocuments({})) === 0;

  const role = isFirstUser ? "admin" : "user";

  const user = await User.create({ name, email, password, role });

  const tokenUser = JWT.createTokenUser(user);
  await JWT.attachCookiesToResponse({ res, user: tokenUser });

  res.status(StatusCodes.CREATED).json({ user: tokenUser });
};

// Login User
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new CustomError.BadRequestError("Email and password is required");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new CustomError.UnauthenticatedError("Invalid logins");
  }

  const isPasswordCorrect = await user.verifyPassword(password);
  if (!isPasswordCorrect) {
    throw new CustomError.UnauthenticatedError("Invalid logins");
  }

  const tokenUser = JWT.createTokenUser(user);

  await JWT.attachCookiesToResponse({ res, user: tokenUser });

  res.status(StatusCodes.OK).json({ user: tokenUser });
};

//Logout User
const logout = async (req, res) => {
  res.cookie("token", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });

  res.status(StatusCodes.OK).send("user logged out");
};

module.exports = {
  register,
  login,
  logout,
};
