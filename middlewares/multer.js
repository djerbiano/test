const multer = require("multer");

const mimeTypes = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/gif": ".gif",
  "image/bmp": ".bmp",
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "images");
  },
  filename: function (req, file, cb) {
    const ext = mimeTypes[file.mimetype];
    const name = file.originalname.split(".")[0].split(" ").join("_");
    cb(null, `${name}${Date.now()}${ext}`);
  },
});

const upload = multer({ storage: storage }).single("image");

module.exports = upload;
