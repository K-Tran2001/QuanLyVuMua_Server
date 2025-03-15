const  {Router} = require('express');
const { GetAllPlant, SeachPlant, CreatePlant, UpdatePlant, DeletePlant, CreatePlant_UploadMulti, UpdatePlant_UploadMulti } = require('../controllers/plantController');
const upload = require("../middleware/tmp/uploadMiddleware");
const multer = require('multer');
const path = require('path');
const router = Router();

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/"); // Thư mục lưu ảnh
//   },
//   filename: (req, file, cb) => {
//     const ext = path.extname(file.originalname);
//     const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9) + ext;
//     cb(null, uniqueName);
//   },
// });

// // Chỉ cho phép upload ảnh (jpg, jpeg, png)
// const fileFilter = (req, file, cb) => {
//   if (file.mimetype.startsWith("image/")) {
//     cb(null, true);
//   } else {
//     cb(new Error("Only images are allowed!"), false);
//   }
// };

// // Tạo middleware upload
// const upload = multer({ storage, fileFilter });



//files là thuộc tính lưu file đơn or list file của formData FE gửi về

router.post("/api/plant/get-all",GetAllPlant)
router.post("/api/plant/search/:id", SeachPlant )
router.post("/api/plant/create",upload.single("files"),CreatePlant)
router.post("/api/plant/create-upload-multi",upload.array("files", 5),CreatePlant_UploadMulti)
router.post("/api/plant/update/:id",upload.single("files"),UpdatePlant)
router.post("/api/plant/update-upload-multi/:id",upload.array("files", 5),UpdatePlant_UploadMulti)
router.post("/api/plant/delete/:id",DeletePlant)



module.exports = router