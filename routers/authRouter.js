const  {Router} = require('express');
const { Login, ChangePassword, SignUp } = require('../controllers/authController');
const router = Router();


router.post("/api/login",Login)
router.post("/api/signup",SignUp)
router.post("/api/change-password",ChangePassword)



module.exports = router