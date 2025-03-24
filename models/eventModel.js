const mongoose = require('mongoose')

const _Schema = new mongoose.Schema({
    title : {
        type:String,
        
    }, 
    start : {
        type:Date,
        
    }, 
    end : {
        type:Date,
        
    }, 
    allDay: {
        type:Boolean,
        default :true
        
    }, 
    extendedProps : {
        type:Object,
        
    }, 
    
},{ timestamps: true } // Tự động thêm createdAt và updatedAt
)

module.exports = mongoose.model("events",_Schema)