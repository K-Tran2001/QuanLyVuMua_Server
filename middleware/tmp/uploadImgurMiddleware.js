const multer = require("multer");

// Cấu hình Multer (lưu file vào bộ nhớ RAM trước khi upload)
const storage = multer.memoryStorage();
const upload = multer({ storage });

module.exports = upload;
