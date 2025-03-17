const  {Router} = require('express');
const { GetAllPesticide, SeachPesticide, CreatePesticide, UpdatePesticide, DeletePesticide, CreatePesticide_UploadMulti, UpdatePesticide_UploadMulti, ImportPesticides, ExportPesticides, ExportWithFilter, ExportAllPesticide } = require('../controllers/pesticideController');
const upload = require("../middleware/tmp/uploadMiddleware");
const uploadExcelFile = require("../middleware/tmp/uploadExcelFileMiddleware");

const router = Router();




//files là thuộc tính lưu file đơn or list file của formData FE gửi về

router.post("/api/pesticide/get-all",GetAllPesticide)
router.post("/api/pesticide/search/:id", SeachPesticide )
router.post("/api/pesticide/create",upload.single("files"),CreatePesticide)
router.post("/api/pesticide/create-upload-multi",upload.array("files", 5),CreatePesticide_UploadMulti)
router.post("/api/pesticide/update/:id",upload.single("files"),UpdatePesticide)
router.post("/api/pesticide/update-upload-multi/:id",upload.array("files", 5),UpdatePesticide_UploadMulti)
router.post("/api/pesticide/delete/:id",DeletePesticide)

//router.post("/api/pesticide/import",upload.single("files"),ImportPesticides)
router.post("/api/pesticide/import",uploadExcelFile.single("files"),ImportPesticides)
router.post("/api/pesticide/export",ExportWithFilter)
router.post("/api/pesticide/export-all",ExportAllPesticide)




module.exports = router