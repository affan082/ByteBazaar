const express = require("express");
const router = express.Router();
const cors = require("cors");
const multer = require("multer");
const stripe = require('stripe')(process.env.STRIPE_TEST_KEY);
const PERMISSIONS = require('../config/Roles_Permissions.json').permissions;
const {
   createUser,
  userSignIn,
  userLogout, getUserData, updateUser, userUpload, listUsers, deleteUser,
  forgotPassword, verifyResetCode, resetPassword, updateSellerStatus, getSellers
} = require("../controllers/user_controller");
const {
  queryProducts,
  addProduct,
  getSingleProduct,
  updateProduct, deleteProduct, getProduct,
} = require("../controllers/product_controller");
const {
  uploadStorage,
  handleUploads,
} = require("../controllers/uploads_controller");
const {addCategory, getCategory, updateCategory, deleteCategory} = require("../controllers/category_controller");
const cartController = require("../controllers/cart-controller");
const {handlePaymentRequest, handlePaymentSuccess, handlePaymentCancel} = require("../controllers/payment_controller");
const {createRole, getRoles, getRoleById, updateRole, deleteRole} = require("../controllers/roles_controller");
const {authorize, authorizeRoles,verifyToken, verifyTokenAllowAll} = require("../utils/AuthUtils");
const {getOrders, updateOrderStatus, generateAnalytics} = require("../controllers/order_controller");
const { addReview, getReviews, deleteReview } = require("../controllers/review_controller");
const { generateAdminAnalytics } = require("../controllers/admin_analytics_controller");
const upload = multer({ storage: uploadStorage });
const wishlistController = require("../controllers/wishlist_controller");
const { verify } = require("jsonwebtoken");

const corsOptions = {
  origin: process.env.FRONTEND_URL,  
  credentials: true,                
};


router.use(cors(corsOptions));  
// Handle preflight (OPTIONS) request for all routes
router.options("*", cors(corsOptions));  // Explicitly use corsOptions for OPTIONS requests

router.use(express.json());

router.get("/test", (req, res) => {
  if (req.session.viewCount) {
    req.session.viewCount++;
  } else {
    req.session.cookie.viewCount = 1;
  }
  res.send(req.session);
});




router.post("/upload", upload.single("image"), handleUploads);

router.delete("/delete-product",deleteProduct);



// User Related Routes
router.post("/signup", createUser);

router.post("/signin", userSignIn);

router.post("/logout", userLogout);

router.post("/forgot-password",verifyTokenAllowAll, forgotPassword);

router.post("/verify-code", verifyResetCode);

router.post("/reset-password",resetPassword);
router.post("/user/data",verifyToken,getUserData);

router.put('/user/update',verifyToken, userUpload.fields([{ name: process.env.USER_PROFILE_IMAGE_KEY, maxCount: 1 }]) , updateUser);
router.get("/admin/user/all", verifyToken, authorizeRoles(["administrator"]), listUsers);
router.delete("/admin/user/delete/:id",verifyToken, authorizeRoles(["administrator"]), deleteUser);
router.post("/admin/user/add", verifyToken, authorizeRoles(["administrator"]), createUser);
router.get("/admin/seller/status", verifyToken, authorizeRoles(["administrator"]), getSellers);
router.put("/admin/seller/status", verifyToken, authorizeRoles(["administrator"]), updateSellerStatus);
router.get("/analytics", verifyToken, authorizeRoles(["administrator"]), generateAdminAnalytics);


router.post("/add-product",verifyToken,authorizeRoles(["seller"]), upload.any(), addProduct);
router.post("/update-product",verifyToken,authorizeRoles(["seller"]), upload.any(), updateProduct);
router.post("/products", queryProducts);
router.get("/product/",verifyToken, getSingleProduct);

// payment routes
router.post("/payment",verifyTokenAllowAll,handlePaymentRequest);

router.get("/payment-success", handlePaymentSuccess);

router.get("/payment-cancel", handlePaymentCancel);



//roles
router.post("/role/add",verifyToken, authorize([PERMISSIONS.MANAGE_ROLES]), createRole);
router.get("/roles", getRoles);
router.get("/role/:id", getRoleById);
router.put("/role/:id",verifyToken, authorize([PERMISSIONS.MANAGE_ROLES]), updateRole);
router.delete("/role/:id",verifyToken, authorize([PERMISSIONS.MANAGE_ROLES]), deleteRole);


//orders
router.get("/orders", verifyToken, getOrders);
router.get("/orders/seller", verifyToken, authorize([PERMISSIONS.GET_ORDER]), getOrders);
router.put("/orders/:id/status", verifyToken, updateOrderStatus);

//analytics
router.get("/seller/analytics", verifyToken, authorizeRoles(["seller"]),generateAnalytics);


//categories
router.post("/category/add", addCategory);
router.post("/category/update",updateCategory);
router.get("/category/",getCategory);
router.delete("/category/delete",deleteCategory);


//cart routes
router.post('/cart/add', verifyToken, cartController.addToCart);
router.get('/cart', verifyToken, cartController.getCart);
router.put('/cart/update', verifyToken, cartController.updateCart);
router.delete('/cart/remove/:productId', verifyToken, cartController.removeFromCart);
router.delete('/cart/clear', verifyToken, cartController.clearCart);

//wishlist routes
router.get('/wishlist',verifyToken, wishlistController.getWishlist);
router.post('/wishlist/toggle',verifyToken, wishlistController.toggleWishlist);
router.delete('/wishlist/clear',verifyToken, wishlistController.clearWishlist);
router.delete('/wishlist/remove/:productId',verifyToken, wishlistController.removeFromWishlist);

// Review routes
router.post("/review/add", verifyToken, addReview);
router.get("/reviews", getReviews);
router.delete("/review/:reviewId", verifyToken, deleteReview);

module.exports = router;
