const  {Router} = require('express');
const { GetAllGarden, SeachGarden, CreateGarden, UpdateGarden, DeleteGarden, CreateGarden_UploadMulti, UpdateGarden_UploadMulti, ImportGardens, ExportGardens, ExportWithFilter, ExportAllGarden, GetAllGardenFK } = require('../controllers/gardenController');
const upload = require("../middleware/tmp/uploadMiddleware");
const uploadExcelFile = require("../middleware/tmp/uploadExcelFileMiddleware");

const router = Router();




//files là thuộc tính lưu file đơn or list file của formData FE gửi về

router.post("/api/garden/get-all",GetAllGarden)
router.post("/api/garden/get-all-fk",GetAllGardenFK)
router.post("/api/garden/search/:id", SeachGarden )
router.post("/api/garden/create",upload.single("files"),CreateGarden)
router.post("/api/garden/create-upload-multi",upload.array("files", 5),CreateGarden_UploadMulti)
router.post("/api/garden/update/:id",upload.single("files"),UpdateGarden)
router.post("/api/garden/update-upload-multi/:id",upload.array("files", 5),UpdateGarden_UploadMulti)
router.post("/api/garden/delete/:id",DeleteGarden)

//router.post("/api/garden/import",upload.single("files"),ImportGardens)
router.post("/api/garden/import",uploadExcelFile.single("files"),ImportGardens)
router.post("/api/garden/export",ExportWithFilter)
router.post("/api/garden/export-all",ExportAllGarden)




module.exports = router