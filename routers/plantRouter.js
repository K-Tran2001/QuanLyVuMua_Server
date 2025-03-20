const  {Router} = require('express');
const { GetAllPlant, SeachPlant, CreatePlant, UpdatePlant, DeletePlant, CreatePlant_UploadMulti, UpdatePlant_UploadMulti, ImportPlants, ExportPlants, ExportWithFilter, ExportAllPlant, GetAllPlantFK } = require('../controllers/plantController');
const upload = require("../middleware/tmp/uploadMiddleware");
const uploadExcelFile = require("../middleware/tmp/uploadExcelFileMiddleware");

const router = Router();




//files là thuộc tính lưu file đơn or list file của formData FE gửi về

router.post("/api/plant/get-all",GetAllPlant)
router.post("/api/plant/get-all-fk",GetAllPlantFK)
router.post("/api/plant/search/:id", SeachPlant )
router.post("/api/plant/create",upload.single("files"),CreatePlant)
router.post("/api/plant/create-upload-multi",upload.array("files", 5),CreatePlant_UploadMulti)
router.post("/api/plant/update/:id",upload.single("files"),UpdatePlant)
router.post("/api/plant/update-upload-multi/:id",upload.array("files", 5),UpdatePlant_UploadMulti)
router.post("/api/plant/delete/:id",DeletePlant)

//router.post("/api/plant/import",upload.single("files"),ImportPlants)
router.post("/api/plant/import",uploadExcelFile.single("files"),ImportPlants)
router.post("/api/plant/export",ExportWithFilter)
router.post("/api/plant/export-all",ExportAllPlant)




module.exports = router