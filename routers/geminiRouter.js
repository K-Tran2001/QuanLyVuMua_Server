const  {Router} = require('express');
const {  geminiChatBot, geminiChatBot_v2 } = require('../controllers/geminiController');
const router = Router();



router.post("/api/geminiChatBot",geminiChatBot)



module.exports = router