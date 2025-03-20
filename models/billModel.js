const mongoose = require('mongoose')

const _Schema = new mongoose.Schema({
    name : {
        type:String,
        
    }, 
    type:{
        type:String,
        default: "sales-invoices", // sales-invoices || purchase-invoices
    },
    isConfirm: {
        type: Boolean,
        default: false, // Giá trị mặc định
    },
    billDetail:{
        type:Array
    },
    images:{
        type:Array
    },
    description : {
        type:String,
        
    }, 
    totalActual : {
        type:Number,
        
    },
    gardenId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "gardens", // Tham chiếu đến Category model
        required: false,
      },
},{ timestamps: true } // Tự động thêm createdAt và updatedAt
)

module.exports = mongoose.model("bills",_Schema)