const  {Router} = require('express');
const { GetRevenue12Month, GetBillDataWithAllType, GetPendingBills } = require('../controllers/dashboardController');


const router = Router();


router.post("/api/dashboard-block-1",GetRevenue12Month)
router.post("/api/dashboard-block-2",GetBillDataWithAllType)
router.post("/api/dashboard-block-3",GetPendingBills)



module.exports = router