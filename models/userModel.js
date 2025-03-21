const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    firstName : {
        type:String,
        //required:true
    },
    lastName : {
        type:String,
        //required:false
    },
    username:{
        type:String,
    },
    password:{
        type:String,
    },
    email:{
        type:String,
    },
    phone:{
        type:String,
    },
    address:{
        type:Object,
    },
    avatar:{
        type:Object,
    },
    
    accessToken:{
        type:String,
    },
    refreshToken:{
        type:String,
    }
},{ timestamps: true })

module.exports = mongoose.model("Users",userSchema)