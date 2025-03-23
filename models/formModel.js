const mongoose = require('mongoose')
// title: headingForm.title,
//           description: headingForm.description,
//           sheetId,
//           linkSubmitForm: "",
//           linkToGGSheet: `https://docs.google.com/spreadsheets/d/${sheetId}/edit?gid=0#gid=0`, //Link = https://docs.google.com/spreadsheets/d/<sheetId>/edit?gid=0#gid=0
//           formDetail: fields[type],
//           count: 0,
//           userId: "khoatranvan",
const formSchema = new mongoose.Schema({
    title : {
        type:String,
        
    },
    description : {
        type:String,
        
    },
    status : {
        type:String,
        
    },
    sheetId : {
        type:String,
        
    },
    linkSubmitForm : {
        type:String,
        
    },
    linkToGGSheet : {
        type:String,
        
    },
    formDetail : {
        type:String,//Json 
        
    },
    status : {
        type:String,//Json 
        default : "Save"
        
    },
    count : {
        type:Number,
        
    },
    userId : {
        type:String,
    },

    
})

module.exports = mongoose.model("forms",formSchema)