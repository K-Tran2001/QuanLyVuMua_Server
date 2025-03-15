const express = require("express");
const router = express.Router();
const uploadImgur = require("../middleware/tmp/uploadImgurMiddleware");
const uploadImgurController = require("../controllers/uploadImgurController");

// // Route upload 1 ảnh
// router.post("/upload-single", upload.single("file"), uploadController.uploadSingleImage);

// Route upload nhiều ảnh (tối đa 5)
router.post("/api/upload-imgur-multiple", uploadImgur.array("files", 5), uploadImgurController.uploadImgurMultipleFiles);

module.exports = router;
