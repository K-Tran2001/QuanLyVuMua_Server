const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name : {
        type:String,
        //required:true
    },
    age : {
        type:Number,
        //required:false
    },
    username:{
        type:String,
    },
    password:{
        type:String,
    },
    accessToken:{
        type:String,
    },
    refreshToken:{
        type:String,
    }
})

module.exports = mongoose.model("Users",userSchema)