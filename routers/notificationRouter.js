const  {Router} = require('express');
const { PushNotification } = require('../controllers/PushNotifyController');
const router = Router();




router.post("/api/push-notify",PushNotification)



module.exports = router