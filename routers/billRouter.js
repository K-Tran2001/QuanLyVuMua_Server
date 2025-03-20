const  {Router} = require('express');
const { GetAllBill, SeachBill, CreateBill, UpdateBill, DeleteBill, CreateBill_UploadMulti, UpdateBill_UploadMulti, ExportWithFilter, ExportAllBill } = require('../controllers/billController');
const upload = require("../middleware/tmp/uploadMiddleware");
const uploadExcelFile = require("../middleware/tmp/uploadExcelFileMiddleware");

const router = Router();




//files là thuộc tính lưu file đơn or list file của formData FE gửi về

router.post("/api/bill/get-all",GetAllBill)
router.post("/api/bill/search/:id", SeachBill )
router.post("/api/bill/create",upload.single("files"),CreateBill)
router.post("/api/bill/create-upload-multi",upload.array("files", 5),CreateBill_UploadMulti)
router.post("/api/bill/update/:id",upload.single("files"),UpdateBill)
router.post("/api/bill/update-upload-multi/:id",upload.array("files", 5),UpdateBill_UploadMulti)
router.post("/api/bill/delete/:id",DeleteBill)

//router.post("/api/bill/import",upload.single("files"),ImportBills)
//router.post("/api/bill/import",uploadExcelFile.single("files"),ImportBills)
router.post("/api/bill/export",ExportWithFilter)
router.post("/api/bill/export-all",ExportAllBill)




module.exports = router