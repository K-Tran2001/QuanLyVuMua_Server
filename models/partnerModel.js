const mongoose = require('mongoose')

const _Schema = new mongoose.Schema({
    name : {
        type:String,
        
    }, 
    phone:{
        type:String
    },
    address:{
        type:String
    },
    images:{
        type:Array
    },
    description : {
        type:String,
        
    }, 
},{ timestamps: true } // Tự động thêm createdAt và updatedAt
)

module.exports = mongoose.model("partners",_Schema)