const mongoose = require('mongoose')

const _Schema = new mongoose.Schema({
    name : {
        type:String,
        
    }, 
    images:{
        type:Array
    },
    description : {
        type:String,
        
    }, 
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "categories", // Tham chiếu đến Category model
        required: false,
      },
},{ timestamps: true } // Tự động thêm createdAt và updatedAt
)

module.exports = mongoose.model("pesticides",_Schema)