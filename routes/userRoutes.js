const {
  getAllUsers,
  showCurrentUser,
  updateUser,
  updateUserPasword,
  getSingleUser,
} = require("../controller/userController");
const {
  authenticateUser,
  authorizeUser,
} = require("../middleware/authentication");

const router = require("express").Router();

router
  .route("/")
  .get(authenticateUser, authorizeUser("owner", "admin"), getAllUsers);

router.route("/showMe").get(showCurrentUser);
router.route("/updateUser").patch(authenticateUser, updateUser);
router.route("/updateUserPassword").patch(authenticateUser, updateUserPasword);
router.route("/:id").get(authenticateUser, getSingleUser);

module.exports = router;
