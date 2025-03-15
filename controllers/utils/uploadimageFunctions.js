
// const { default: axios } = require("axios");
// const cloudinary = require("../config/cloudinary");

// const {IMGUR_CLIENT_ID} = process.env


// ///Upload sigle
// const uploadFunction = async(req,res)=>{
// }

// const uploadCloudinaryFunction = async(req,res)=>{
// }

// const uploadImgurFunction = async(req,res)=>{
// }


// ///Upload multi
//  const uploadMultiFunction = async(req,res,typeAction)=>{//typeAction : "create" || "update"
//     try {
//         var id = null
//         typeAction === "update" &&(id  = req.params.id); // Lấy ID từ URL params
        
        
//         const {name , description, oldImages = [], deleteImages=[]} = req.body; // Dữ liệu cập nhật
//         const dataFindById = await plantModel.findById(id);
//         var updateData = {
//           name, categoryId : new ObjectId("67d15bf94fada66e9cd56f0e"), description
//         }
//         //Xư lý xóa ảnh deleteImages

//         //
//         var imagePaths = []
//         var imagePaths_v2 = []
//         var _oldImages = []
//         var _deleteImages = []
//         try {
//           _oldImages = JSON.parse(oldImages)
//           _oldImages = _oldImages.filter(item=>item != null)
//         } catch (error) {
//             _oldImages = []
//         }
//         try {
//           _deleteImages = JSON.parse(deleteImages)
//           _deleteImages = _deleteImages.filter(item=>item != null)
//         } catch (error) {
//             _deleteImages = []
//         }
//         //Goi ham xoa anh


//         //
        
//         if (req.files && req.files.length > 0) {//Có upload mới
//           imagePaths = req.files.map((file,index) =>({
//             imageAbsolutePath:`${req.protocol}://${req.get("host")}/uploads/${file.filename}`,
//             fileName: file.filename,
//             keyToDelete : file.path,
//             imageBase64String: "",
//             imageFile: null,
//             isNewUpload:false,
//             displayOrder:index

//           })); 
          
//           imagePaths_v2 = [..._oldImages,...imagePaths]; 
//         } else if(req.files.length === 0 &&typeAction ==="update"){//Không upload ảnh
//           // Không xóa ảnh -> ko cần cập nhật lại images
//           if(_deleteImages?.length > 0){//Có xóa ảnh cần lọc lại những ảnh chưa bị xóa để cập nhật

//             var filterImages =  filterRemainingImages(dataFindById.images,_deleteImages,"imageAbsolutePath")
//             //Goi hàm xóa ảnh dựa vào _deleteImages

//             imagePaths_v2 = filterImages
//           }
//         }

//         return imagePaths_v2
//     } catch (error) {
//       return []
//     }
//  }


// const uploadMultiCloudinaryFunction = async(req,res,typeAction)=>{
//   try {
//       var id = null
//       typeAction === "update" &&(id  = req.params.id); // Lấy ID từ URL params
      
//       const {name , description, oldImages = [], deleteImages=[]} = req.body; // Dữ liệu cập nhật
//       const dataFindById = await plantModel.findById(id);
//       var updateData = {
//         name, categoryId : new ObjectId("67d15bf94fada66e9cd56f0e"), description
//       }
//       //Xư lý xóa ảnh deleteImages

//       //
//       var imagePaths = []
//       var imagePaths_v2 = []
//       var _oldImages = []
//       var _deleteImages = []
//       try {
//         _oldImages = JSON.parse(oldImages)
//         _oldImages = _oldImages.filter(item=>item != null)
//       } catch (error) {
//           _oldImages = []
//       }
//       try {
//         _deleteImages = JSON.parse(deleteImages)
//         _deleteImages = _deleteImages.filter(item=>item != null)
//       } catch (error) {
//           _deleteImages = []
//       }
//       //Goi ham xoa anh


//       //
      
//       if (req.files && req.files.length > 0) {//Có upload mới

//         let uploadResults = [];
        
//         for (const file of req.files) {
//           const result = await cloudinary.uploader.upload(file.path, {
//             folder: "my_upload",//"uploads", // Thư mục trên Cloudinary
//             quality: "auto",
//           });
    
//           uploadResults.push(result);
//           fs.unlinkSync(file.path); // Xóa file sau khi upload
//         }
    
//           imagePaths = uploadResults?.length > 0 ? uploadResults.map((item,index)=>({
//           imageAbsolutePath: item.secure_url,
//           fileName: `${item.original_filename}.${item.format}`,
//           keyToDelete : item.public_id,
//           imageBase64String: "",
//           imageFile: null,
//           isNewUpload:false,
//           displayOrder:index
//         })):[]
        
//         imagePaths_v2 = [..._oldImages,...imagePaths]; 
//       } else if(req.files.length === 0 &&typeAction ==="update"){//Không upload ảnh
//         // Không xóa ảnh -> ko cần cập nhật lại images
//         if(_deleteImages?.length > 0){//Có xóa ảnh cần lọc lại những ảnh chưa bị xóa để cập nhật

//           var filterImages =  filterRemainingImages(dataFindById.images,_deleteImages,"imageAbsolutePath")
//           //Goi hàm xóa ảnh dựa vào _deleteImages

//           imagePaths_v2 = filterImages
//         }
//       }

//       return imagePaths_v2
//   } catch (error) {
//     return []
//   }
// }



// const uploadMultiImgurFunction = async(req,res,typeAction)=>{
//   try {
//       var id = null
//       typeAction === "update" &&(id  = req.params.id); // Lấy ID từ URL params
      
//       const {name , description, oldImages = [], deleteImages=[]} = req.body; // Dữ liệu cập nhật
//       const dataFindById = await plantModel.findById(id);
//       var updateData = {
//         name, categoryId : new ObjectId("67d15bf94fada66e9cd56f0e"), description
//       }
//       //Xư lý xóa ảnh deleteImages

//       //
//       var imagePaths = []
//       var imagePaths_v2 = []
//       var _oldImages = []
//       var _deleteImages = []
//       try {
//         _oldImages = JSON.parse(oldImages)
//         _oldImages = _oldImages.filter(item=>item != null)
//       } catch (error) {
//           _oldImages = []
//       }
//       try {
//         _deleteImages = JSON.parse(deleteImages)
//         _deleteImages = _deleteImages.filter(item=>item != null)
//       } catch (error) {
//           _deleteImages = []
//       }
//       //Goi ham xoa anh


//       //
      
//       if (req.files && req.files.length > 0) {//Có upload mới

//         const uploadPromises = req.files.map(async (file) => {
//         const imageBase64 = file.buffer.toString("base64");
  
//         const response = await axios.post(
//           "https://api.imgur.com/3/upload",
//           { image: imageBase64, type: "base64" },
//           { headers: { Authorization: `Client-ID ${IMGUR_CLIENT_ID}` } }
//         );
  
//         //return response.data.data.link;
//         return response.data.data //deleteHash: response.data.data.deletehash
//       });
  
//       const uploadResults = await Promise.all(uploadPromises);
  
//       var imagePaths = uploadResults?.length > 0 ? uploadResults.map((item,index)=>({
//         imageAbsolutePath: item.link,
//         fileName: item.link.replace("https://i.imgur.com/", ""),
//         keyToDelete : item.deletehash,
//         imageBase64String: "",
//         imageFile: null,
//         isNewUpload:false,
//         displayOrder:index
//       })):[]
    

        
//         imagePaths_v2 = [..._oldImages,...imagePaths]; 
//       } else if(req.files.length === 0 &&typeAction ==="update"){//Không upload ảnh
//         // Không xóa ảnh -> ko cần cập nhật lại images
//         if(_deleteImages?.length > 0){//Có xóa ảnh cần lọc lại những ảnh chưa bị xóa để cập nhật

//           var filterImages =  filterRemainingImages(dataFindById.images,_deleteImages,"imageAbsolutePath")
//           //Goi hàm xóa ảnh dựa vào _deleteImages

//           imagePaths_v2 = filterImages
//         }
//       }

//       return imagePaths_v2
//   } catch (error) {
//     return []
//   }
// }



//  ///Delete function
// const deleteImage = (imagePath) => {//keyToDelete
// const fullPath = path.join(__dirname, 'uploads', imagePath);

// fs.unlink(fullPath, (err) => {
//     if (err) {
//         return ({
//         succsess: false,
//         data: null,
//         message:"Lỗi xóa ảnh"
//         })
//     } else {
//         return ({
//         succsess: true,
//         data: null,
//         message:"Ảnh đã được xóa thành công!"
//         })
//     }
// });
// };

// const deleteImage_Cloudinary = async (public_id) => {//keyToDelete
// try {

//     if (!public_id) {
//     return res.status(400).json({ message: "Missing public_id" });
//     }

//     const result = await cloudinary.uploader.destroy(public_id);

//     if (result.result === "ok") {
//     return ({
//         succsess: true,
//         data: result,
//         message:"Xóa ảnh thành công"
//     })
//     } else {
//     return ({
//         succsess: false,
//         data: null,
//         message:"Lỗi khi xóa ảnh"
//     })
//     }
// } catch (error) {
//     return ({
//     succsess: false,
//     data: null,
//     message:"Lỗi: "+error.message
//     })
// }
// };

// const deleteImage_Imgur = async(deleteHash)=>{//keyToDelete
//   try {

//     if (!deleteHash) {
//       return res.status(400).json({ message: "Missing deleteHash" });
//     }

//     const response = await axios.delete(`https://api.imgur.com/3/image/${deleteHash}`, {
//       headers: { Authorization: `Client-ID ${IMGUR_CLIENT_ID}` },
//     });

//     return ({
//       succsess: true,
//       data: response.data,
//     })
//   } catch (error) {
//     return ({
//       succsess: false,
//       data: null,
//     })
//   }
// }


// function filterRemainingImages(oldImages, deleteImages, key = "id") {
//   return oldImages.filter(item => !deleteImages.some(del => del[key] === item[key]));
// }