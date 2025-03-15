const mongoose = require('mongoose')

const _Schema = new mongoose.Schema({
    name : {
        type:String,
        
    }, 
},{ timestamps: true } // Tự động thêm createdAt và updatedAt
)

module.exports = mongoose.model("categories",_Schema)