const  {Router} = require('express');
const { PushNotification, PushFCMNotification } = require('../controllers/PushNotifyController');
const router = Router();




router.post("/api/push-notify",PushNotification)

router.post("/api/push-fcm-notify",PushFCMNotification)



module.exports = router