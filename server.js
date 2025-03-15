const express =  require('express')
const mongoose = require('mongoose')
require('dotenv').config()
const cors = require('cors')
const app = express()
const authRouter = require('./routers/authRouter')
const categoryRouter = require('./routers/categoryRouter')
const plantRouter = require('./routers/plantRouter')
const uploadRoter = require('./routers/uploadRoter')
const uploadCloudinaryRoter = require('./routers/uploadCloudinaryRoter')
const uploadImgurRoter = require('./routers/uploadImgurRoter')
const geminiRouter = require('./routers/geminiRouter')

const PORT = process.env.PORT || 5000
app.use(express.json())
app.use(cors())

// Cho phép truy cập ảnh từ thư mục "uploads"
app.use("/uploads", express.static("uploads"));


app.use(plantRouter);
app.use(authRouter)
app.use(categoryRouter)
app.use(uploadRoter)
app.use(uploadImgurRoter)
app.use(uploadCloudinaryRoter)
app.use(geminiRouter)

// app.use(cors({
//     origin: '*', // hoặc cụ thể 'http://your-expo-ip:port'
// }));
// Cho phép tất cả các origin hoặc chỉ định domain cụ thể
app.use(cors({
    origin: 'https://quanlyvumua.vercel.app', // Chỉ cho phép trang web của bạn truy cập
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));




mongoose.connect(process.env.MONGO_URI)
    .then(()=>console.log("Mongo conected....."))
    .catch(err => console.log(err))

app.listen(PORT,()=>console.log(`Listen at port ${PORT}`)
)