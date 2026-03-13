const multer = require("multer");
// const path = require("path");

exports.uploadStorage = multer.diskStorage({
  destination: process.env.UPLOAD_PATH,
  filename: (req, file, cb) => {
    cb(
      null,
      new Date().toISOString().replace(/:/g, "-") + "-" + file.originalname
    );
  },
});

exports.handleUploads = (req, res) => {
  //   console.log(req.file); // access the uploaded file
  console.log(req.file); // access the other form data
  if (!req.file) {
    res.status(500).send({ message: "The File could not be uploaded" });
  } else {
    res.status(200).send({ message: "File uploaded successfully" });
  }
};
