const { productStorage } = require("../utils/cloudinary");

exports.uploadStorage = productStorage;

exports.handleUploads = (req, res) => {
  //   console.log(req.file); // access the uploaded file
  console.log(req.file); 
  if (!req.file) {
    res.status(500).send({ message: "The File could not be uploaded" });
  } else {
    res.status(200).send({ message: "File uploaded successfully" });
  }
};
