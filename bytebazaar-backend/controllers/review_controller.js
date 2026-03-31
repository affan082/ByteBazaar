const Review = require("../models/ReviewSchema");
const { User } = require("../models/UserSchema");
const Product = require("../models/ProductSchema");
const APIResponse = require("../utils/APIResponse");
const APIError = require("../utils/APIError");
const mongoose = require("mongoose");

exports.addReview = async (req, res) => {
  try {
    const { productId, rating, title, comment } = req.body;
    const userId = req.user?.user?._id || req.user?._id;

    if (!productId || !rating || !comment) {
      return res.status(400).send(new APIError(400, "All fields are required"));
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).send(new APIError(404, "Product not found"));
    }

    const Order = mongoose.model("Order");
    const hasPurchased = await Order.findOne({
      buyer: userId,
      "cart.product": productId,
      status: "Completed",
    });

    if (!hasPurchased) {
      return res
        .status(403)
        .send(new APIError(403, "You can only review products you have purchased"));
    }

    const existingReview = await Review.findOne({
      product: productId,
      user: userId,
    });

    if (existingReview) {
      return res
        .status(409)
        .send(new APIError(409, "You have already reviewed this product"));
    }

    const review = await Review.create({
      product: productId,
      user: userId,
      rating,
      comment,
    });

    const reviews = await Review.find({ product: productId });
    const avgRating =
      reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    await Product.updateOne({ _id: productId }, { rating: avgRating });
    res
      .status(201)
      .send(new APIResponse(201, "Review added successfully", review));
  } catch (error) {
    console.error("Add review error:", error);
    res.status(500).send(new APIError(500, error.message));
  }
};

exports.getReviews = async (req, res) => {
  try {
    const { productId } = req.query;

    if (!productId) {
      return res.status(400).send(new APIError(400, "Product ID is required"));
    }

    const reviews = await Review.find({ product: productId })
      .populate("user", "fullname profileImageUrl")
      .sort({ createdAt: -1 });

    res.status(200).send(new APIResponse(200, "Reviews fetched", reviews));
  } catch (error) {
    console.error("Get reviews error:", error);
    res.status(500).send(new APIError(500, error.message));
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user?.user?._id || req.user?._id;
    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).send(new APIError(404, "Review not found"));
    }

    if (review.user.toString() !== userId.toString()) {
      return res
        .status(403)
        .send(new APIError(403, "You can only delete your own reviews"));
    }

    const productId = review.product;
    await Review.deleteOne({ _id: reviewId });

    const reviews = await Review.find({ product: productId });
    const avgRating =
      reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;
    await Product.updateOne({ _id: productId }, { rating: avgRating });

    res.status(200).send(new APIResponse(200, "Review deleted successfully"));
  } catch (error) {
    console.error("Delete review error:", error);
    res.status(500).send(new APIError(500, error.message));
  }
};