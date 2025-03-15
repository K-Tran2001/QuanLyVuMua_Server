const  {Router} = require('express');
const { getAPI, geminiChatBot } = require('../controllers/geminiController');
const router = Router();



router.post("/api/geminiChatBot",geminiChatBot)



module.exports = router