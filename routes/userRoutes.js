const {
  getAllUsers,
  showCurrentUser,
  updateUser,
  updateUserPasword,
  getSingleUser,
} = require("../controller/userController");

const router = require("express").Router();

router.route("/").get(getAllUsers);

router.route("/showMe").get(showCurrentUser);
router.route("/updateUser").patch(updateUser);
router.route("/updateUserPassword").patch(updateUserPasword);
router.route("/:id").get(getSingleUser);

module.exports = router;
