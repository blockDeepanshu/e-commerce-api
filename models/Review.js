const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema(
  {
    rating: {
      type: Number,
      required: [true, "Product review rating is required"],
      min: 1,
      max: 5,
    },
    title: {
      type: String,
      required: [true, "Product review title is required"],
      maxLength: 50,
    },
    comment: {
      type: String,
      required: [true, "Product review comment is required"],
      maxLength: 100,
    },
    product: {
      type: mongoose.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

ReviewSchema.index({ product: 1, user: 1 }, { unique: true });

module.exports = mongoose.model("Review", ReviewSchema);
