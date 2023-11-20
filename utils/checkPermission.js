const CustomError = require("../errors");

const checkPermission = (currentUser, passedUserId) => {
  if (currentUser.role === "admin") return;
  if (currentUser.userId === passedUserId.toString()) return;

  throw new CustomError.UnauthorizedError(
    "Not allowed to access this information"
  );
};

module.exports = checkPermission;
