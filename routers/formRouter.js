const  {Router} = require('express');
const { GetAllForm, SeachForm, CreateOrUpdateForm, CreateForm, UpdateForm, DeleteForm, PublishForm } = require('../controllers/formController');
const router = Router();



router.post("/api/form/get-all",GetAllForm)
router.post("/api/form/search/:id",SeachForm)
router.post("/api/form/create-or-update",CreateOrUpdateForm)
router.post("/api/form/create",CreateForm)
router.post("/api/form/update/:id",UpdateForm)
router.post("/api/form/delete/:id",DeleteForm)
router.post("/api/form/publish/:id",PublishForm)



module.exports = router