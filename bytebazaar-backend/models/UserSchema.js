const { default: mongoose, model, Mongoose} = require("mongoose");

const UserType = {
  BUYER:"buyer",
  SELLER:"seller",
  ADMIN:"administrator",
}
const UserSchema = new mongoose.Schema({
  fullname: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  dob: { type: Date, required: false },
  gender: { type: String, required: false },
  address: { type: String, required: false },
  phone: {type: String, required: false},
  profileImageUrl: { type: String, required: false },
  createdAt: { type: Date, required: false, default: new Date() },
  cart: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: process.env.MODEL_NAME_PRODUCT,
        required: true
      },
      quantity: {
        type: Number,
        required: true,
        min: 1
      },
    addedAt: {
      type: Date,
      default: Date.now
    }
   }
  ],
  wishlist: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: process.env.MODEL_NAME_PRODUCT,
        required: true
      }
    }
  ],
  roles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Role' }]
},{
  timestamps: true
});
UserSchema.index({ 'cart.product': 1 });
UserSchema.index({ "wishlist.product": 1 });


const buyerProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  orderHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }],
});


const sellerProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  shopName: { type: String, required: true },
  businessType: { type: String, enum: ["individual", "sole_proprietorship", "company"] },
  businessCategory: { type: String },
  businessAddress: { type: String, required: false },
  cnic: { type: String, required: true },
  bankAccountTitle: { type: String, required: false },
  bankAccountNumber: { type: String, required: false },
  bankName: { type: String, required: false },
  bankBranch: { type: String, required: false },
  emergencyContact: { type: String, required: false },
  status: { type: String, enum: ["pending", "verified", "rejected"], default: "pending" }
});


const adminProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  permissions: [{ type: String }],
  activityLogs: [{ type: String }]
});

const User = mongoose.model("User", UserSchema);
const BuyerProfile = mongoose.model("BuyerProfile", buyerProfileSchema);
const SellerProfile = mongoose.model("SellerProfile", sellerProfileSchema);
const AdminProfile = mongoose.model("AdminProfile", adminProfileSchema);

module.exports = { User, BuyerProfile, SellerProfile, AdminProfile };