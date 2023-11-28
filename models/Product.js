const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Product name is required"],
      maxLength: [100, "Product name should be less than 100 characters"],
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
      maxLength: [1000, "Product name should be less than 1000 characters"],
    },
    image: {
      type: String,
    },
    category: {
      type: String,
      required: [true, "Product category is required"],
      enum: {
        values: ["office", "kitchen", "bedroom"],
        message: "{VALUE} category is not supported",
      },
    },
    company: {
      type: String,
      required: [true, "Company is required"],
      enum: {
        values: ["ikea", "liddy", "marcos"],
        message: "{VALUE} company is not supported",
      },
    },
    colors: {
      type: [String],
      required: true,
      default: ["#222"],
    },
    featured: {
      type: Boolean,
      default: false,
    },
    freeShipping: {
      type: Boolean,
      default: false,
    },
    inventory: {
      type: Number,
      required: true,
      default: 15,
    },
    averageRating: {
      type: Number,
      default: 0,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);
