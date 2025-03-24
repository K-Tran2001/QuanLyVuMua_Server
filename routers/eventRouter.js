const  {Router} = require('express');
const { GetAllEvent, SeachEvent, CreateEvent, UpdateEvent, DeleteEvent } = require('../controllers/eventController');
const router = Router();


router.post("/api/event/get-all",GetAllEvent)
router.post("/api/event/search/:id",SeachEvent)
router.post("/api/event/update/:id",UpdateEvent)
router.post("/api/event/create",CreateEvent)
router.post("/api/event/delete/:id",DeleteEvent)



module.exports = router