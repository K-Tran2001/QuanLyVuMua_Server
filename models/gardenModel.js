const mongoose = require('mongoose')

const _Schema = new mongoose.Schema({
    name : {
        type:String,
        
    }, 
    numberOfPlants:{
        type:Number
    },
    landArea:{
        type:Number
    },
    gardenDetail:{
        type:Array
    },
    images:{
        type:Array
    },
    description : {
        type:String,
        
    }, 
},{ timestamps: true } // Tự động thêm createdAt và updatedAt
)

module.exports = mongoose.model("gardens",_Schema)