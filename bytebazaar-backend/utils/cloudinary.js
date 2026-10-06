const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
const { extname } = require("path");

// Configure Cloudinary credentials from environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Check if Cloudinary credentials are provided in .env
const isCloudinaryConfigured = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
);

if (isCloudinaryConfigured) {
  console.log("☁️  Cloudinary is configured and active for file uploads.");
} else {
  console.log("📁 Cloudinary credentials not found in .env; falling back to local disk storage.");
}

// Product Storage Engine: Uses Cloudinary if configured, otherwise falls back to local disk
const productStorage = isCloudinaryConfigured
  ? new CloudinaryStorage({
      cloudinary: cloudinary,
      params: {
        folder: "bytebazaar/products",
        allowed_formats: ["jpg", "jpeg", "png", "webp", "gif", "svg"],
      },
    })
  : multer.diskStorage({
      destination: (req, file, cb) => cb(null, process.env.UPLOAD_PATH || "uploads/"),
      filename: (req, file, cb) => {
        cb(
          null,
          new Date().toISOString().replace(/:/g, "-") + "-" + file.originalname
        );
      },
    });

// User Profile Storage Engine: Uses Cloudinary if configured, otherwise falls back to local disk
const userStorage = isCloudinaryConfigured
  ? new CloudinaryStorage({
      cloudinary: cloudinary,
      params: {
        folder: "bytebazaar/users",
        allowed_formats: ["jpg", "jpeg", "png", "webp"],
      },
    })
  : multer.diskStorage({
      destination: (req, file, cb) => cb(null, process.env.USER_CONTENT_DIR || "uploads/users/"),
      filename: (req, file, cb) =>
        cb(
          null,
          file.fieldname +
            "-" +
            new Date().toISOString().replace(/:/g, "-") +
            extname(file.originalname)
        ),
    });

// Helper function to extract the image URL or filename regardless of storage engine
const getFileLocation = (file) => {
  if (!file) return undefined;
  return file.path && file.path.startsWith("http") ? file.path : file.filename;
};

module.exports = {
  cloudinary,
  isCloudinaryConfigured,
  productStorage,
  userStorage,
  getFileLocation,
};
