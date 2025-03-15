const  {Router} = require('express')
const router = Router();

const {getAllUser,createOrUpdateUser,createUser} =require('../controllers/userController')

router.get("/users",getAllUser)

router.get("/add-user",createOrUpdateUser)
router.post("/test-add-user",createUser)

module.exports = router