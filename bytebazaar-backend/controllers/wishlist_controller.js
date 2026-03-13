const Product = require("../models/ProductSchema");
const { User } = require("../models/UserSchema");

exports.getWishlist = async (req, res) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated"
      });
    }

    const user = await User.findById(userId)
      .populate('wishlist.product')
      .select('wishlist');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const wishlist = user.wishlist.filter(item => item.product);

    return res.status(200).json({
      success: true,
      wishlist
    });

  } catch (error) {
    console.error("Get wishlist error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

exports.toggleWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated"
      });
    }

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required"
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const existingIndex = user.wishlist.findIndex(
      item => item.product.toString() === productId
    );

    let message;
    let isInWishlist;

    if (existingIndex > -1) {
      user.wishlist.splice(existingIndex, 1);
      message = "Product removed from wishlist";
      isInWishlist = false;
    } else {
      user.wishlist.push({ product: productId });
      message = "Product added to wishlist";
      isInWishlist = true;
    }

    await user.save();
    await user.populate('wishlist.product');

    return res.status(200).json({
      success: true,
      message,
      isInWishlist,
      wishlist: user.wishlist
    });

  } catch (error) {
    console.error("Toggle wishlist error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

exports.removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user?._id;
    const user = await User.findById(userId);
    user.wishlist = user.wishlist.filter(
      item => item.product.toString() !== productId 
    );
    await user.save();
    await user.populate('wishlist.product');
    res.status(200).json({
      success: true,
      message: "Product removed from wishlist",
      wishlist: user.wishlist
    });
  }
  catch (error) {
    console.error("Remove from wishlist error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

exports.clearWishlist = async (req, res) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated"
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    user.wishlist = [];
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Wishlist cleared successfully",
      wishlist: []
    });

  } catch (error) {
    console.error("Clear wishlist error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};