const express = require("express");
const router = express.Router();
const upload = require("../middleware/tmp/uploadMiddleware");
const uploadController = require("../controllers/uploadController");

// Route upload 1 ảnh
router.post("/api/upload-single", upload.single("file"), uploadController.uploadSingleImage);

// Route upload nhiều ảnh (tối đa 5)
router.post("/api/upload-multiple", upload.array("files", 5), uploadController.uploadMultipleImages);

module.exports = router;
