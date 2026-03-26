const { User, BuyerProfile, SellerProfile } = require("../models/UserSchema");
const Product = require("../models/ProductSchema");
const PasswordRecoverySchema = require("../models/PasswordRecoverySchema");
const {Role, ROLES_KEYS} = require("../models/RolesSchema");
const mongoose = require("mongoose");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const { diskStorage } = require("multer");
const { extname } = require("node:path");

const ErrorMessages = require("../config/ErrorMessages.json");
const APIError = require("../utils/APIError");
const APIResponse = require("../utils/APIResponse");
const { MailTransporter } = require("./mail_controller");
const { issueAuthToken } = require("../utils/AuthUtils");
const sgMail = require('@sendgrid/mail')
const encryptRounds = Number(process.env.HASH_ENCRYPT_ROUNDS);


exports.createUser = async (req, res) => {
  const data = req.body;
  let currentUser = req.user?._id;
  let isCurrentUserAdmin = false;

  try{
    currentUser = await User.findById(currentUser).populate("roles");
    isCurrentUserAdmin = currentUser.roles.some(r => r.name === ROLES_KEYS.ADMIN);
  }
  catch (e){
    console.error("Error in createUser:", e);
    currentUser = null;
    isCurrentUserAdmin = false;
  }

  if (!data || Object.keys(data).length === 0) {
    return res
        .status(400)
        .send(new APIError(400, ErrorMessages.UserAuthErrors.MISSING_CREDENTIALS));
  }

  const { username, email, password, fullname, roles } = data;

  try {
    if (!username || !email || !password || !fullname || !roles || roles.length === 0) {
      return res.status(400).send(
          new APIError(
              400,
              ErrorMessages.UserAuthErrors.MISSING_CREDENTIALS,
              "MISSING_CREDENTIALS",
              "All required fields must be filled."
          )
      );
    }

    if (await User.findOne({ email })) {
      return res
          .status(409)
          .send(
              new APIError(
                  409,
                  ErrorMessages.UserAuthErrors.EMAIL_ALREADY_EXISTS,
                  "EMAIL_ALREADY_EXISTS"
              )
          );
    }
    if (await User.findOne({ username })) {
      return res
          .status(409)
          .send(
              new APIError(
                  409,
                  ErrorMessages.UserAuthErrors.USERNAME_ALREADY_EXISTS,
                  "USERNAME_ALREADY_EXISTS"
              )
          );
    }

    const hash = await bcrypt.hash(password, encryptRounds);


    const roleId = roles[0];
    let roleDoc;
    if (mongoose.Types.ObjectId.isValid(roleId)) {
      roleDoc = await Role.findById(roleId);
    } else {
      return res
          .status(400)
          .send(new APIError(400, "Invalid role specified"));
    }

    if (!roleDoc) {
      return res
          .status(400)
          .send(new APIError(400, "Role does not exist"));
    }

    // Block Creating as Admin
    if(roleDoc.name === ROLES_KEYS.ADMIN && !isCurrentUserAdmin) {
      return res
          .status(400)
          .send(new APIError(400, "Admin cannot be created"));
    }

    const user = new User({
      fullname,
      username,
      email,
      passwordHash: hash,
      roles: [roleDoc._id],
    });

    const userData = await user.save();

    // Role-specific profile
    if (roleDoc.name === "seller") {
      const { shopName, cnic, bankAccountNumber, bankName } = data;
      if (!shopName || !cnic || !bankAccountNumber) {
        await User.deleteOne({ _id: userData._id });
        return res.status(400).send(
            new APIError(
                400,
                ErrorMessages.ValidationErrors.MISSING_REQUIRED_FIELD,
                "SELLER_MISSING_FIELDS",
                "Shop name, CNIC, and Bank Account Number are required for sellers."
            )
        );
      }
      await new SellerProfile({
        user: userData._id,
        shopName,
        cnic,
        bankAccountNumber,
        bankName,
      }).save();
    }

    if (roleDoc.name === "buyer") {
      await new BuyerProfile({ user: userData._id }).save();
    }

    if(!isCurrentUserAdmin){
      issueAuthToken(res, { _id: userData._id, roles: userData.roles });
    }

    const _res = new APIResponse(201, "User registered successfully", {
      id: userData._id,
      username,
      email,
      roles: userData.roles,
    });
    return res.status(_res.statusCode).send(_res);
  } catch (err) {
    console.error("Error in createUser:", err);
    return res.status(500).send(
        new APIError(
            500,
            ErrorMessages.ServerErrors.INTERNAL_ERROR,
            "INTERNAL_ERROR",
            err.message
        )
    );
  }
};
exports.updateUser = async (req, res) => {
  try {
    const userId = req.body._id ?? req.user._id;
    const {
      fullname,
      username,
      email,
      phone,
      dob,
      gender,
      address,
      password,
      confirmPassword,
      shopName,
      businessType,
      businessCategory,
      businessAddress,
      cnic,
      bankAccountTitle,
      bankAccountNumber,
      bankName,
      bankBranch,
      emergencyContact
    } = req.body;
    // console.log(req.body);

    let updates = {};
    if (fullname) updates.fullname = fullname;
    if (username) updates.username = username;
    if (email) updates.email = email;
    if (phone) updates.phone = phone;
    if (dob) updates.dob = dob;
    if (gender) updates.gender = gender;
    if (address) updates.address = address;
    if (req.files && req.files[process.env.USER_PROFILE_IMAGE_KEY]) {
      updates.profileImageUrl =
          req.files[process.env.USER_PROFILE_IMAGE_KEY][0].filename;
    }

    if (password && confirmPassword) {
      if (password !== confirmPassword) {
        return res.status(400).send(
            new APIError(
                400,
                "Passwords do not match",
                ErrorMessages.UserAuthErrors.INVALID_CREDENTIALS
            )
        );
      }
      const salt = await bcrypt.genSalt(10);
      updates.passwordHash = await bcrypt.hash(password, salt);
    }

    const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $set: updates },
    ).select("-passwordHash");

    if (!updatedUser) {
      return res.status(404).send(
          new APIError(
              404,
              "User not found",
              ErrorMessages.RequestFailureErrors.NOT_FOUND
          )
      );
    }

    if (updatedUser.roles && updatedUser.roles.length) {
      const roleNames = await Role.find({ _id: { $in: updatedUser.roles } }).select("name");
      const roleNamesList = roleNames.map(r => r.name);

      if (roleNamesList.includes("seller")) {
        let sellerUpdates = {};
        if (shopName) sellerUpdates.shopName = shopName;
        if (businessType) sellerUpdates.businessType = businessType;
        if (businessCategory) sellerUpdates.businessCategory = businessCategory;
        if (businessAddress) sellerUpdates.businessAddress = businessAddress;
        if (cnic) sellerUpdates.cnic = cnic;
        if (bankAccountTitle) sellerUpdates.bankAccountTitle = bankAccountTitle;
        if (bankAccountNumber) sellerUpdates.bankAccountNumber = bankAccountNumber;
        if (bankName) sellerUpdates.bankName = bankName;
        if (bankBranch) sellerUpdates.bankBranch = bankBranch;
        if (emergencyContact) sellerUpdates.emergencyContact = emergencyContact;

        await SellerProfile.findOneAndUpdate(
            { user: userId },
            { $set: sellerUpdates },
            { new: true }
        );
      }
    }

    const _res = new APIResponse(
        200,
        "Profile updated successfully",
        updatedUser
    );
    return res.status(200).send(_res);
  } catch (err) {
    console.error("Update User Error:", err);
    return res.status(500).send(
        new APIError(
            500,
            "Failed to update profile",
            ErrorMessages.ServerErrors.INTERNAL_ERROR,
            err.message
        )
    );
  }
};


exports.userSignIn = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    // console.log("username ",username,password)
    return res
        .status(400)
        .send(new APIError(400, ErrorMessages.UserAuthErrors.MISSING_CREDENTIALS));
  }

  try {
    const user = await User.findOne({ username });
    // console.log("username ",username,password)
    if (!user) {
      return res
          .status(404)
          .send(
              new APIError(
                  404,
                  "User does not exist",
                  ErrorMessages.UserAuthErrors.USER_NOT_FOUND
              )
          );
    }
// console.log("username ",username,password)
    const isPasswordCorrect = await bcrypt.compare(
        password,
        user.passwordHash
    );

    if (!isPasswordCorrect) {
      return res
          .status(401)
          .send(
              new APIError(
                  401,
                  "Password is incorrect.",
                  ErrorMessages.UserAuthErrors.INVALID_CREDENTIALS
              )
          );
    }

    issueAuthToken(res, { _id: user._id, roles: user.roles });
    return res
        .status(200)
        .send(new APIResponse(200, "Successfully Logged In"));
  } catch (err) {
    console.error("SignIn Error:", err);
    return res
        .status(500)
        .send(
            new APIError(
                500,
                ErrorMessages.ServerErrors.INTERNAL_ERROR,
                "INTERNAL_ERROR",
                err.message
            )
        );
  }
};

exports.userLogout = async (req, res) => {
  res.clearCookie(process.env.AUTH_TOKEN_KEY_TITLE, {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    path: "/",
  });

  return res
      .status(200)
      .send(new APIResponse(200, "Successfully Logged out"));
};



exports.getUserData = async (req, res) => {
  try {
    // console.log("user id ", req.user?._id)
    const userId = req.user?._id;
    if (!userId) {
      return res
          .status(400)
          .send(new APIError(400, "No user ID found in token"));
    }

    const user = await User.findById(userId)
        .populate("roles")
        .select("-passwordHash");

    if (!user) {
      return res.status(404).send(new APIError(404, "User Not Found"));
    }

    // fix profile image url
    if (user.profileImageUrl) {
      user.profileImageUrl =
          process.env.SERVER_URL +
          ":" +
          process.env.PORT +
          "/" +
          user.profileImageUrl;
    }

    let sellerProfile = null;
    if (user.roles && user.roles.length) {
      const roleNames = user.roles.map((r) =>
          typeof r === "string" ? r : r.name
      );
      if (roleNames.includes("seller")) {
        sellerProfile = await SellerProfile.findOne({ user: userId });
      }
    }
    let buyerProfile = null;
    if (user.roles && user.roles.length) {
      const roleNames = user.roles.map((r) =>
          typeof r === "string" ? r : r.name
      );
      if (roleNames.includes("buyer")) {
        buyerProfile = await BuyerProfile.findOne({ user: userId });
      }
    }

    const responseData = {
      ...user.toObject(),
      sellerProfile,
      buyerProfile,
    };

    return res
        .status(200)
        .send(new APIResponse(200, "User Found", responseData));
  } catch (err) {
    console.error("getUserData Error:", err);
    return res
        .status(500)
        .send(new APIError(500, "Failed to get user", err.message));
  }
};

exports.listUsers = async (req, res) => {
  try{
    const users = await User.find({}).populate("roles");
    if(!users || !users.length) return res.status(404).send(new APIError(404, "Users not found"));
    return res.status(200).send(new APIResponse(200, "Users Found", users));
  }
  catch (e){
    return res.status(500).send(new APIError(500, "Failed to get users", e.message));
  }
}


exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    if (!userId) {
      return res
        .status(400)
        .send(new APIError(400, "User ID not provided"));
    }

    const user = await User.findOne({ _id: userId }).populate("roles");

    if (!user) {
      return res
        .status(404)
        .send(new APIError(404, "User not found"));
    }

    if (user.roles.some(r => r.name === "admin")) {
      return res
        .status(400)
        .send(new APIError(400, "Admin cannot be deleted"));
    }

    if (user.roles.some(r => r.name === "seller")) {
      try {
        await Product.deleteMany({ seller: userId });
      } catch (e) {
        return res
          .status(500)
          .send(new APIError(500, "Failed to delete products", e.message));
      }
    }

    await User.findByIdAndDelete(userId);

    return res
      .status(200)
      .send(new APIResponse(200, "User deleted successfully"));

  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .send(new APIError(500, "Failed to delete user", e.message));
  }
};


exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res
        .status(400)
        .send(new APIError(400, "Email not provided"));
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).send(new APIError(404, "User not found"));
  }

  const resetCode = Math.floor(100000 + Math.random() * 900000).toString(); 

  const jwtToken = jwt.sign({ resetCode, email }, process.env.JWT_SECRET_KEY, { expiresIn: "15m" });

  res.cookie(process.env.RESET_CODE_COOKIE_KEY, jwtToken, {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    path: "/",
    maxAge: 1000 * 60 * 15,
  });

  const mailOptions = {
    from: ` ${process.env.APPLICATION_NAME} <${process.env.SMTP_USERNAME}>`,
    to: email,
    subject: "Password Reset Code",
    text: `Your password reset code is: ${resetCode}. 
    It will expire in 15 minutes.`
  }
  try{
    await MailTransporter.sendMail(mailOptions);
    return res.status(200).send( new APIResponse(200, "Reset code sent to your email"));
  }catch(error){
    return res.status(500).send( new APIError(500, "Failed to send reset code."));
  }  
};


exports.verifyResetCode = async (req, res) => {
  const { resetCode } = req.body;
  if (!resetCode) {
    return res.status(400).send(new APIError(400, "Reset code not provided"));
  }

  try {
    const jwtToken = req.cookies[process.env.RESET_CODE_COOKIE_KEY];
    if (!jwtToken) {
      return res.status(400).send(new APIError(400, "Reset session expired or missing"));
    }
    const decoded = jwt.verify(jwtToken, process.env.JWT_SECRET_KEY);

    if (resetCode !== decoded.resetCode) {
      return res.status(400).send(new APIError(400, "Reset code is invalid"));
    }

    return res.status(200).send(new APIResponse(200, "Reset code is valid"));
  } catch (err) {
    return res.status(400).send(new APIError(400, "Invalid or expired reset token"));
  }
};

exports.resetPassword = async (req, res) => {
  const { email, password } = req.body;
  if (!password || !email) {
    return res
        .status(400)
        .send(new APIError(400, "Passwords not provided"));
  }

  try{
     const user = await User.findOne({ email }).populate("roles");
    if (!user) {return res.status(404).send(new APIError(404, "User not found"));}
    user.passwordHash = await bcrypt.hash(password, encryptRounds);
    await user.save();
    res.clearCookie(process.env.RESET_CODE_COOKIE_KEY, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      path: "/",
    });
    issueAuthToken(res, { _id: user._id, roles: user.roles });
    return res.status(200).send(new APIResponse(200, "Password reset successfully"));
  }
  catch (err){
    return res.status(500).send(new APIError(500, "Failed to reset password"));
  }

}


const userStorage = diskStorage({
  destination: (req, file, cb) => cb(null, process.env.USER_CONTENT_DIR),
  filename: (req, file, cb) =>
      cb(null, file.fieldname + "-" + new Date().toISOString().replace(/:/g, "-") + extname(file.originalname)),
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png/;
  const ext = allowedTypes.test(extname(file.originalname).toLowerCase());
  const mime = allowedTypes.test(file.mimetype);
  if (ext && mime) cb(null, true);
  else cb(new Error("Only images are allowed!"), false);
};

exports.userUpload = multer({
  storage: userStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter,
});
