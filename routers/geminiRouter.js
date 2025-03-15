const  {Router} = require('express');
const { getAPI, geminiChatBot } = require('../controllers/geminiController');
const router = Router();



router.get("/api/getMethod",(req,res)=>res.json({response:"hello"}))
router.post("/api/geminiChatBot",geminiChatBot)



module.exports = router