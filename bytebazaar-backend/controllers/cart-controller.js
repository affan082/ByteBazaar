const Product = require("../models/ProductSchema");
const {User} = require("../models/UserSchema");

exports.addToCart = async (req, res) => {
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
    
    const existingItemIndex = user.cart.findIndex(
      item => item.product.toString() === productId
    );

    if (existingItemIndex > -1) {
      user.cart[existingItemIndex].quantity += 1;
    } else {
      user.cart.push({ product: productId, quantity: 1 });
    }

    await user.save();
    await user.populate('cart.product');
    return res.status(200).json({
      success: true,
      message: "Product added to cart",
      cart: user.cart
    });
  } catch (error) {
    console.error("Add to cart error:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Server error",
      error: error.message 
    });
  }
};

exports.getCart = async (req, res) => {
  try {
    const userId = req.user?._id; 
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated"
      });
    }

    const user = await User.findById(userId)
      .populate('cart.product')
      .select('cart');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }
    let totalItems = 0;
    let totalPrice = 0;
    
    const cartWithTotals = user.cart.map(item => {
      const itemPrice = item.product?.price || 0;
      const itemTotal = itemPrice * item.quantity;
      totalItems += item.quantity;
      totalPrice += itemTotal;
      
      return {
        _id: item._id,
        product: item.product,
        quantity: item.quantity,
        total: itemTotal,
        addedAt: item.addedAt
      };
    });

    return res.status(200).json({
      success: true,
      cart: cartWithTotals,
      summary: {
        totalItems,
        totalPrice,
        cartCount: cartWithTotals.length
      }
    });
    
  } catch (error) {
    console.error("Get cart error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

exports.updateCart = async (req, res) => {
  try {    
    const userId = req.user._id;  
    let cartItems = [];
    
    if (req.body.cart && Array.isArray(req.body.cart)) {      
      cartItems = req.body.cart;
    } 
    else if (req.body.productId && req.body.quantity !== undefined) {     
      cartItems = [req.body];
    }
    else {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid request format." 
      });
    }
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }

    if (req.body.productId && !req.body.cart) {
      const { productId, quantity } = req.body;
      
      const itemIndex = user.cart.findIndex(
        item => item.product && item.product.toString() === productId
      );
      
      if (itemIndex === -1 && quantity > 0) {
        user.cart.push({
          product: productId,
          quantity: quantity,
          addedAt: new Date()
        });
      } 
      else if (itemIndex !== -1) {
        if (quantity ===0 ) {
          user.cart.splice(itemIndex, 1);
        } else {
          user.cart[itemIndex].quantity = quantity;
        }
      }
    } 
    else {
      const validCart = [];
      for (const item of cartItems) {
        const product = await Product.findById(item.productId);
        if (product && item.quantity > 0) {
          validCart.push({
            product: item.productId,
            quantity: item.quantity
          });
        }
      }
      user.cart = validCart;
    }

    await user.save();
    
    await user.populate('cart.product');

    res.status(200).json({
      success: true,
      message: "Cart updated successfully",
      cart: user.cart
    });

  } catch (error) {
    console.error("Update cart error:", error);
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.params;
    const user = await User.findById(userId);
    
    user.cart = user.cart.filter(
      item => item.product.toString() !== productId
    );
    await user.save();    
    await user.populate('cart.product');
    res.status(200).json({
      success: true,
      message: "Product removed from cart",
      cart: user.cart
    });
  } catch (error) {
    console.error("Remove from cart error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error",
      error: error.message 
    });
  }
};

exports.clearCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    user.cart = [];
    await user.save();
    res.status(200).json({
      success: true,
      message: "Cart cleared successfully",
      cart: []
    });
  } catch (error) {
    console.error("Clear cart error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error",
      error: error.message 
    });
  }
};