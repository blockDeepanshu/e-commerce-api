const { StatusCodes } = require("http-status-codes");
const Product = require("../models/Product");
const CustomError = require("../errors");
const cloudinary = require("cloudinary").v2;

const path = require("path");
const fs = require("fs");

const createProduct = async (req, res) => {
  req.body.user = req.user.userId;
  const product = await Product.create(req.body);
  res.status(StatusCodes.CREATED).json({ product });
};

const getAllProducts = async (req, res) => {
  const products = await Product.find({});

  res.status(StatusCodes.OK).json({ products, total: products.length });
};

const getSingleProduct = async (req, res) => {
  const productId = req.params.id;
  const product = await Product.findOne({ _id: productId });
  if (!product) {
    throw new CustomError.NotFoundError(
      `No product available with id : ${productId}`
    );
  }

  res.status(StatusCodes.OK).json({ product });
};

const updateProduct = async (req, res) => {
  const productId = req.params.id;
  const product = await Product.findOneAndUpdate({ _id: productId }, req.body, {
    new: true,
    runValidators: true,
  });
  if (!product) {
    throw new CustomError.NotFoundError(
      `No product available with id : ${productId}`
    );
  }

  res.status(StatusCodes.OK).json({ product });
};

const deleteProduct = async (req, res) => {
  const productId = req.params.id;
  const product = await Product.findOne({ _id: productId });
  if (!product) {
    throw new CustomError.NotFoundError(
      `No product available with id : ${productId}`
    );
  }
  await product.deleteOne();
  res.status(StatusCodes.OK).json({ msg: "Product deleted" });
};

const uploadImage = async (req, res) => {
  const productId = req.params.id;
  const product = await Product.findOne({ _id: productId });
  if (!product) {
    throw new CustomError.NotFoundError(
      `No product available with id : ${productId}`
    );
  }

  if (!req.files.image) {
    throw new CustomError.BadRequestError("Please provide an image file");
  }

  if (!req.files.image.mimetype.startsWith("image")) {
    throw new CustomError.BadRequestError("Please upload image");
  }
  const maxSize = 1024 * 1024 * 5;
  if (req.files.image.size > maxSize) {
    throw new CustomError.BadRequestError(
      "Product image cannot be greater than 5MB"
    );
  }

  const uploadPath = path.join(
    __dirname,
    "../public/uploads",
    req.files.image.name
  );

  req.files.image.mv(uploadPath);

  const result = await cloudinary.uploader.upload(uploadPath, {
    use_filename: true,
    folder: "file-upload",
  });

  console.log(result);

  fs.unlink(uploadPath);

  product.image = result.secure_url;

  await product.save();

  res.status(StatusCodes.OK).json({ msg: "File uploaded", product });
};

module.exports = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
};
