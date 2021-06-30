const multer = require("multer");
const { v4 } = require("uuid");
const path = require("path");

const imageMimeType = {
  "image/jpg": "jpg",
  "image/jpeg": "jpeg",
  "image/png": "png",
};

exports.imageUpload = multer({
  limits: 300000,
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "images");
    },
    filename: (req, file, cb) => {
      const fileExtension = imageMimeType[file.mimetype];
      const fileName = v4() + "." + fileExtension;
      cb(null, fileName);
    },
  }),
  fileFilter: (req, file, cb) => {
    const isValid = !!imageMimeType[file.mimetype];
    let error = isValid ? null : new Error("Image format is not accepted");
    cb(error, isValid);
  },
});
