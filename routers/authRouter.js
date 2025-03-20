const  {Router} = require('express');
const { Login, SignUp, ChangePassword } = require('../controllers/authController2');

const router = Router();


router.post("/api/login",Login)
router.post("/api/signup",SignUp)
router.post("/api/change-password",ChangePassword)



module.exports = router