const { GoogleGenerativeAI } = require("@google/generative-ai");
const BaseResponse = require("./BaseResponse");



const genAI = new GoogleGenerativeAI(process.env.GEMINI_APIKEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });




module.exports.geminiChatBot = async (req, res) => {
    const response = new BaseResponse();
    try {
      const {userMessage,chatHistory=[]} = req.body;

      var _chatHistory = []
      try {
        _chatHistory = JSON.parse(chatHistory)
        _chatHistory = _chatHistory.filter(item=>item != null)
      } catch (error) {
        _chatHistory = []
      }
      _chatHistory = [..._chatHistory,{ role: "user",  parts: [{ text : userMessage }]}]
      
      
      //return res.json({_chatHistory:_chatHistory})
      // Lịch sử hội thoại
      const chat = model.startChat({
        history: [
          {
            role: "user",
            parts: [{ text: "Hello" }],
          },
          {
            role: "model",
            parts: [{ text: "Great to meet you. What would you like to know?" }],
          },
        ],
        // history: _chatHistory.length > 0 ? _chatHistory.map((item)=>(
        //   {
        //     role: item.role,
        //     parts: [{ text: item.text }],
        //   }
        // )) : [],
      });
  
      // Gửi tin nhắn đầu tiên
      let result = await chat.sendMessageStream(userMessage);
      let responseText = '';
  
      for await (const chunk of result.stream) {
        responseText += chunk.text();
      }
  
      // Trả về kết quả cho frontend
      response.success = true;
      response.data = responseText;
      res.json(response);
    } catch (error) {
      response.success = false;
      response.message =  error.toString() 
      res.status(500).json(response);
    }
  };


module.exports.geminiChatBot_v2 = async (req, res) => {
    const response = new BaseResponse();
    try {
        const { userMessage, chatHistory = "[]" } = req.body;

        let _chatHistory = [];
        try {
            _chatHistory = JSON.parse(chatHistory).filter(item => 
                item && item.role && item.parts && Array.isArray(item.parts)
            );
        } catch (error) {
            _chatHistory = [];
        }

        // Thêm tin nhắn người dùng vào lịch sử
        _chatHistory.push({ role: "user", parts: [{ text: userMessage }] });

        // Khởi tạo cuộc trò chuyện với toàn bộ lịch sử
        const chat = model.startChat({
            history: _chatHistory,
        });

        // Gửi tin nhắn và nhận phản hồi
        let result = await chat.sendMessageStream(userMessage);
        let responseText = '';

        for await (const chunk of result.stream) {
            responseText += chunk.text();
        }

        // Lưu phản hồi vào lịch sử để dùng cho lần sau
        _chatHistory.push({ role: "model", parts: [{ text: responseText }] });

        // Trả về dữ liệu cho frontend
        response.success = true;
        response.data = responseText;
        res.json(response);
    } catch (error) {
        response.success = false;
        response.message = error.toString();
        res.status(500).json(response);
    }
};






