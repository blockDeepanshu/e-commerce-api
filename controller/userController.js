const User = require("../models/User");
const CustomError = require("../errors");
const { StatusCodes } = require("http-status-codes");
const {
  createTokenUser,
  attachCookiesToResponse,
  checkPermission,
} = require("../utils");

// Get All Users list - Only Admin
const getAllUsers = async (req, res) => {
  const users = await User.find({ role: "user" }).select("-password -__v");
  res.status(StatusCodes.OK).json(users);
};

// Get a single User using user ID
const getSingleUser = async (req, res) => {
  const user = await User.findOne({ _id: req.params.id }).select(
    "-password -__v"
  );
  if (!user) {
    throw new CustomError.NotFoundError(
      `User not found with id : ${req.params.id}`
    );
  }
  checkPermission(req.user, req.params.id);
  res.status(StatusCodes.OK).json(user);
};

// Show the current logged In user
const showCurrentUser = async (req, res) => {
  res.status(StatusCodes.OK).json({ user: req.user });
};

// Update the logged in user
const updateUser = async (req, res) => {
  const { email, name } = req.body;

  if (!email || !name) {
    throw new CustomError.BadRequestError("Provide all values");
  }

  const user = await User.findOneAndUpdate(
    { _id: req.user.userId },
    { email, name },
    { new: true, runValidators: true }
  );

  const tokenUser = createTokenUser(user);
  await attachCookiesToResponse({ res, user: tokenUser });

  res.status(StatusCodes.OK).json({ user: tokenUser });
};

// Update user password
const updateUserPasword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    throw new CustomError.BadRequestError("Both old and new password required");
  }

  const user = await User.findOne({ _id: req.user.userId });

  const isPasswordCorrect = await user.verifyPassword(oldPassword);
  if (!isPasswordCorrect) {
    throw new CustomError.UnauthenticatedError("User not authenticated");
  }

  user.password = newPassword;
  await user.save();
  res.status(StatusCodes.OK).json({ msg: "Password updated" });
};

module.exports = {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPasword,
};
