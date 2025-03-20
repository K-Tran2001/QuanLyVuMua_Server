const  {Router} = require('express');
const { GetAllPartner, SeachPartner, CreatePartner, UpdatePartner, DeletePartner, CreatePartner_UploadMulti, UpdatePartner_UploadMulti, ImportPartners, ExportPartners, ExportWithFilter, ExportAllPartner } = require('../controllers/partnerController');
const upload = require("../middleware/tmp/uploadMiddleware");
const uploadExcelFile = require("../middleware/tmp/uploadExcelFileMiddleware");

const router = Router();




//files là thuộc tính lưu file đơn or list file của formData FE gửi về

router.post("/api/partner/get-all",GetAllPartner)
router.post("/api/partner/search/:id", SeachPartner )
router.post("/api/partner/create",upload.single("files"),CreatePartner)
router.post("/api/partner/create-upload-multi",upload.array("files", 5),CreatePartner_UploadMulti)
router.post("/api/partner/update/:id",upload.single("files"),UpdatePartner)
router.post("/api/partner/update-upload-multi/:id",upload.array("files", 5),UpdatePartner_UploadMulti)
router.post("/api/partner/delete/:id",DeletePartner)

//router.post("/api/partner/import",upload.single("files"),ImportPartners)
router.post("/api/partner/import",uploadExcelFile.single("files"),ImportPartners)
router.post("/api/partner/export",ExportWithFilter)
router.post("/api/partner/export-all",ExportAllPartner)




module.exports = router