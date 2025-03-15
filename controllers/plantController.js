
const fs = require('fs');
const path = require('path');
const plantModel = require("../models/plantModel");
const BaseResponse = require('./BaseResponse');
const ObjectId = require('mongoose').Types.ObjectId;


module.exports.GetAllPlant = async (req, res) => {
  const response = new BaseResponse();
  try {
    const { keySearch, page = 1, pageSize = 10, sortField = "createdAt", sortOrder = "desc" } = req.body;

    // Tạo bộ lọc tìm kiếm
    const filter = {};
    if (keySearch) {
      filter.$or = [
        { title: { $regex: keySearch, $options: "i" } },
        { description: { $regex: keySearch, $options: "i" } },
      ];
    }

    // Xác định hướng sắp xếp (1: tăng dần, -1: giảm dần)
    const sortDirection = sortOrder.toLowerCase() === "asc" ? 1 : -1;
    const sortOptions = { [sortField]: sortDirection };

    // Lấy tổng số bản ghi thỏa mãn điều kiện
    const totalRecords = await plantModel.countDocuments(filter);

    // Truy vấn dữ liệu có phân trang và sắp xếp
    // const data = await plantModel
    //   .find(filter)
    //   .populate("categoryId", "name") // Lấy name từ bảng categories
    //   .sort(sortOptions) // Áp dụng sắp xếp
    //   .skip((page - 1) * pageSize)
    //   .limit(parseInt(pageSize));

    const data = await plantModel.aggregate([
      { $match: filter },
      {
        $lookup: {
          from: "categories",
          localField: "categoryId",
          foreignField: "_id",
          as: "category",
        },
      },
      { $unwind: "$category" }, // Giải nén category
      {
        $project: {
          name: 1,
          description: 1,
          images:1,
          createdAt: 1,
          categoryId: 1,
          categoryName: "$category.name", // Đổi tên name thành categoryName
        },
      },
      { $sort: sortOptions },
      { $skip: (page - 1) * pageSize },
      { $limit: parseInt(pageSize) },
    ]);
    


    // Trả về kết quả cho frontend
    response.success = true;
    response.data = data;
    response.metaData = {
      totalRecords: totalRecords,
      totalPages: Math.ceil(totalRecords / pageSize),
      currentPage: parseInt(page),
      pageSize: parseInt(pageSize),
    };

    res.json(response);
  } catch (error) {
    response.success = false;
    response.message = error.toString();
    res.status(500).json(response);
  }
};


module.exports.SeachPlant = async (req, res) => {
  let response = new BaseResponse();
    try {
        const { id } = req.params; // Lấy ID từ URL params

        if (!id) {
            response.success = false;
            response.message = "id is required";
            return res.status(400).json(response);
        }

        //const result = await plantModel.findById(id); // Tìm kiếm theo ID trong MongoDB
        const result = await plantModel.aggregate([
          { $match: { _id: new ObjectId(id) } }, // Tìm kiếm theo id
          {
            $lookup: {
              from: "categories",
              localField: "categoryId",
              foreignField: "_id",
              as: "category",
            },
          },
          { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } }, // Giữ document dù categoryId null
          {
            $project: {
              name: 1,
              description: 1,
              images: 1,
              createdAt: 1,
              categoryId: 1,
              categoryName: { $ifNull: ["$category.name", ""] }, // Nếu không có category, trả về chuỗi rỗng ""
            },
          },
        ]);

        if (!result) {
            response.success = false;
            response.message = "Data not found";
            return res.status(404).json(response);
        }

        response.data = result;
        response.message = "Form found successfully";
        res.json(response);
    } catch (error) {
        response.success = false;
        response.message = error.toString();
        response.data = null;
        res.status(500).json(response);
    }
};


module.exports.CreatePlant = async (req, res) => {
  const response = new BaseResponse();
    try {
      
      const {name, description, categoryId = null} = req.body;
      
      // if (req.files && newData.files.length > 0) {
      //   const imagePaths = newData.files.map(file => `/uploads/${file.filename}`); 
      //   newData.images = imagePaths; 
      // } else {
      //   newData.images = []; // Nếu không có ảnh, để mảng rỗng
      // }

      const imagePath = req.file ? `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}` : "";
      const newData = {
        name,description,categoryId,images:
        req.file ?
        [
          {
            imageAbsolutePath:imagePath,
            fileName: file.filename,
            keyToDelete : file.path,
            imageBase64String: "",
            imageFile: null,
            isNewUpload:false,
            displayOrder:0
          }
        ]
        :[]
      }
      
      //Truy vấn monggo
        const result = await plantModel.create(newData);
        if (!result) {
          response.success = false
          response.message='Có lỗi trong quá trình thực hiện, vui lòng thử lại.'
          return res.json(response);
        }
        response.success = true
        response.data = result?._id
        res.json(response);
    } catch (error) {
      response.success = false
      response.message=error.toString()
      res.status(500).json(response);
    }
};
module.exports.CreatePlant_UploadMulti = async (req, res) => {
  const response = new BaseResponse();
    try {
      
      const {name, description, categoryId = null, } = req.body;
      const newData = {
        name,description,categoryId : new ObjectId("67d15bf94fada66e9cd56f0e"),images:[]
      }

      var imagePaths = []
      
      if (req.files && req.files.length > 0) {
        imagePaths = req.files.map((file,index) =>({
          imageAbsolutePath:`${req.protocol}://${req.get("host")}/uploads/${file.filename}`,
          fileName: file.filename,
          keyToDelete : file.path,
          imageBase64String: "",
          imageFile: null,
          isNewUpload:false,
          displayOrder:index

        })); 
        
      }
      

      newData.images = imagePaths; 

      //Truy vấn monggo
        const result = await plantModel.create(newData);
        if (!result) {
          response.success = false
          response.message='Có lỗi trong quá trình thực hiện, vui lòng thử lại.'
          return res.json(response);
        }
        response.success = true
        response.data = result?._id
        res.json(response);
    } catch (error) {
      response.success = false
      response.message=error.toString()
      res.status(500).json(response);
    }
};


module.exports.UpdatePlant = async (req, res) => {
  const response = new BaseResponse();
  try {
    const { id } = req.params; // Lấy ID từ URL params
    const {name , description, oldImages = [], deleteImages=[]} = req.body; // Dữ liệu cập nhật
    const dataFindById = await plantModel.findById(id);
    //Xư lý xóa ảnh deleteImages

    //
    var imagePaths = [];
    var _oldImages = []
    var _deleteImages = []
    try {
      _oldImages = JSON.parse(oldImages)
      _oldImages = _oldImages.filter(item=>item != null)
    } catch (error) {
        _oldImages = []
    }
    try {
      _deleteImages = JSON.parse(deleteImages)
      _deleteImages = _deleteImages.filter(item=>item != null)
    } catch (error) {
        _deleteImages = []
    }
    
    const updateData = {
      name, categoryId : new ObjectId("67d15bf94fada66e9cd56f0e"), description 
    }
    if(req.file){
      const imagePath = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
      imagePaths = [
        {
          imageAbsolutePath:imagePath,
          fileName: file.filename,
          keyToDelete : file.path,
          imageBase64String: "",
          imageFile: null,
          isNewUpload:false,
          displayOrder:0
        }
      ]
    }else{
      if(_deleteImages?.length > 0){//Có xóa ảnh cần lọc lại những ảnh chưa bị xóa để cập nhật
        
        var filterImages =  filterRemainingImages(dataFindById.images,_deleteImages,"imageAbsolutePath")
        //Goi hàm xóa ảnh dựa vào _deleteImages

        imagePaths = filterImages
      }
    }

    updateData.images = imagePaths; 
      
    
    const result = await plantModel.findByIdAndUpdate(id, updateData, { new: true });

    if (!result) {
      response.success = false;
      response.message = "Không tìm thấy dữ liệu cần cập nhật.";
      return res.json(response);
    }

    response.success = true;
    response.data = result._id;
    res.json(response);
  } catch (error) {
    response.success = false;
    response.message = error.toString();
    res.status(500).json(response);
  }
};

module.exports.UpdatePlant_UploadMulti = async (req, res) => {
  const response = new BaseResponse();
  try {
    const { id } = req.params; // Lấy ID từ URL params
    const {name , description, oldImages = [], deleteImages=[]} = req.body; // Dữ liệu cập nhật
    const dataFindById = await plantModel.findById(id);
    var updateData = {
      name, categoryId : new ObjectId("67d15bf94fada66e9cd56f0e"), description
    }
    //Xư lý xóa ảnh deleteImages

    //
    var imagePaths = []
    var imagePaths_v2 = []
    var _oldImages = []
    var _deleteImages = []
    try {
      _oldImages = JSON.parse(oldImages)
      _oldImages = _oldImages.filter(item=>item != null)
    } catch (error) {
        _oldImages = []
    }
    try {
      _deleteImages = JSON.parse(deleteImages)
      _deleteImages = _deleteImages.filter(item=>item != null)
    } catch (error) {
        _deleteImages = []
    }
    
    if (req.files && req.files.length > 0) {//Có upload mới
      imagePaths = req.files.map((file,index) =>({
        imageAbsolutePath:`${req.protocol}://${req.get("host")}/uploads/${file.filename}`,
        fileName: file.filename,
        keyToDelete : file.path,
        imageBase64String: "",
        imageFile: null,
        isNewUpload:false,
        displayOrder:index

      })); 
      
      imagePaths_v2 = [..._oldImages,...imagePaths]; 
    } else {//Không upload ảnh
      // Không xóa ảnh -> ko cần cập nhật lại images
      if(_deleteImages?.length > 0){//Có xóa ảnh cần lọc lại những ảnh chưa bị xóa để cập nhật

        var filterImages =  filterRemainingImages(dataFindById.images,_deleteImages,"imageAbsolutePath")
        //Goi hàm xóa ảnh dựa vào _deleteImages

        imagePaths_v2 = filterImages
      }
    }

    updateData.images =imagePaths_v2

    const result = await plantModel.findByIdAndUpdate(id, updateData, { new: true });

    if (!result) {
      response.success = false;
      response.message = "Không tìm thấy dữ liệu cần cập nhật.";
      return res.json(response);
    }

    response.success = true;
    response.data = result._id;
    res.json(response);
  } catch (error) {
    response.success = false;
    response.message = error.toString();
    res.status(500).json(response);
  }
};

module.exports.DeletePlant = async (req, res) => {
  const response = new BaseResponse();
  try {
    const { id } = req.params; // Lấy ID từ URL params

    const result = await plantModel.findByIdAndDelete(id);

    if (!result) {
      response.success = false;
      response.message = "Không tìm thấy dữ liệu để xóa.";
      return res.json(response);
    }

    response.success = true;
    response.message = "Xóa  thành công!";
    res.json(response);
  } catch (error) {
    response.success = false;
    response.message = error.toString();
    res.status(500).json(response);
  }
};

function filterRemainingImages(oldImages, deleteImages, key = "id") {
  return oldImages.filter(item => !deleteImages.some(del => del[key] === item[key]));
}

const deleteImage = (imagePath) => {//keyToDelete
  const fullPath = path.join(__dirname, 'uploads', imagePath);
  
  fs.unlink(fullPath, (err) => {
      if (err) {
        return ({
          succsess: false,
          data: null,
          message:"Lỗi xóa ảnh"
        })
      } else {
        return ({
          succsess: true,
          data: null,
          message:"Ảnh đã được xóa thành công!"
        })
      }
  });
};













