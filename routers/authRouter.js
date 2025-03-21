const  {Router} = require('express');
const { Login, SignUp, ChangePassword, UpdateUserProfile, SeachUserProfiles } = require('../controllers/authController2');
const upload = require("../middleware/tmp/uploadMiddleware");
const router = Router();


router.post("/api/login",Login)
router.post("/api/signup",SignUp)
router.post("/api/change-password",ChangePassword)
router.post("/api/update-user-profile/:id",upload.array("files"),UpdateUserProfile)
router.post("/api/search-profile/:id",SeachUserProfiles)



module.exports = router