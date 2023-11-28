const {
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
  createProduct,
} = require("../controller/productController");
const {
  authenticateUser,
  authorizeUser,
} = require("../middleware/authentication");

const router = require("express").Router();

router
  .route("/")
  .get(getAllProducts)
  .post([authenticateUser, authorizeUser("admin")], createProduct);

router.post(
  "/:id/upload",
  [authenticateUser, authorizeUser("admin")],
  uploadImage
);

router
  .route("/:id")
  .get(getSingleProduct)

  .patch([authenticateUser, authorizeUser("admin")], updateProduct)
  .delete([authenticateUser, authorizeUser("admin")], deleteProduct);

module.exports = router;
