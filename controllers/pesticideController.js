
const fs = require('fs');
const path = require('path');
const pesticideModel = require("../models/pesticideModel");
const BaseResponse = require('./BaseResponse');
const xlsx = require("xlsx");
const ObjectId = require('mongoose').Types.ObjectId;


module.exports.GetAllPesticide = async (req, res) => {
  const response = new BaseResponse();
  try {
    const { keySearch, categoryId = null, page = 1, pageSize = 10, sortField = "createdAt", sortOrder = "desc", sortOptions } = req.body;

    // Tạo bộ lọc tìm kiếm
    const filter = {};
    if (keySearch) {
      filter.$or = [
        { name: { $regex: keySearch, $options: "i" } },
        { description: { $regex: keySearch, $options: "i" } },
      ];
    }
    // Nếu categoryId có giá trị hợp lệ, thêm vào filter
    if (categoryId && ObjectId.isValid(categoryId)) {
      filter.categoryId = new ObjectId(categoryId);
    }

    // Lấy tổng số bản ghi thỏa mãn điều kiện
    const totalRecords = await pesticideModel.countDocuments(filter);


    const data = await pesticideModel.aggregate([
      { $match: filter },
      {
        $lookup: {
          from: "categories",
          localField: "categoryId",
          foreignField: "_id",
          as: "category",
        },
      },
      { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } }, // Giải nén category
      {
        $project: {
          name: 1,
          description: 1,
          images:1,
          createdAt: 1,
          categoryId: 1,
          categoryName: { $ifNull: ["$category.name", ""] }, // Đổi tên name thành categoryName và check null thì trả về ""
        },
      },
      { $sort: sortOptions || { _id: 1 }},
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


module.exports.SeachPesticide = async (req, res) => {
  let response = new BaseResponse();
    try {
        const { id } = req.params; // Lấy ID từ URL params

        if (!id) {
            response.success = false;
            response.message = "id is required";
            return res.status(400).json(response);
        }

        //const result = await pesticideModel.findById(id); // Tìm kiếm theo ID trong MongoDB
        const result = await pesticideModel.aggregate([
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


module.exports.CreatePesticide = async (req, res) => {
  const response = new BaseResponse();
    try {
      
      const {name, description, categoryId = null} = req.body;
      

      const imagePath = req.file ? `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}` : "";
      const newData = {
        name,description,categoryId : categoryId ? new ObjectId(categoryId) :null, images:
        req.file ?
        [
          {
            imageAbsolutePath:imagePath,
            fileName: file.filename,
            keyToDelete : path.join(__dirname, "..",file.path),
            imageBase64String: "",
            imageFile: null,
            isNewUpload:false,
            displayOrder:0
          }
        ]
        :[]
      }
      
      //Truy vấn monggo
        const result = await pesticideModel.create(newData);
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
module.exports.CreatePesticide_UploadMulti = async (req, res) => {
  const response = new BaseResponse();
    try {
      
      const {name, description, categoryId = null, } = req.body;
      const newData = {
        name,description,categoryId: categoryId ? new ObjectId(categoryId) :null ,images:[]
      }
      var imagePaths = []
      
      if (req.files && req.files.length > 0) {
        imagePaths = req.files.map((file,index) =>({
          imageAbsolutePath:`${req.protocol}://${req.get("host")}/uploads/${file.filename}`,
          fileName: file.filename,
          keyToDelete : path.join(__dirname, "..",file.path),
          imageBase64String: "",
          imageFile: null,
          isNewUpload:false,
          displayOrder:index

        })); 
        
      }
      

      newData.images = imagePaths; 

      //Truy vấn monggo
        const result = await pesticideModel.create(newData);
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


module.exports.UpdatePesticide = async (req, res) => {
  const response = new BaseResponse();
  try {
    const { id } = req.params; // Lấy ID từ URL params
    const {name , description,categoryId = null , oldImages = [], deleteImages=[]} = req.body; // Dữ liệu cập nhật
    const dataFindById = await pesticideModel.findById(id);
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
      name, categoryId : new ObjectId(categoryId), description 
    }
    if(req.file){
      const imagePath = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
      imagePaths = [
        {
          imageAbsolutePath:imagePath,
          fileName: file.filename,
          keyToDelete : path.join(__dirname, "..",file.path),
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
      
    
    const result = await pesticideModel.findByIdAndUpdate(id, updateData, { new: true });

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

module.exports.UpdatePesticide_UploadMulti = async (req, res) => {
  const response = new BaseResponse();
  try {
    const { id } = req.params; // Lấy ID từ URL params
    const {name , description, oldImages = [], deleteImages=[]} = req.body; // Dữ liệu cập nhật
    const dataFindById = await pesticideModel.findById(id);
    var updateData = {
      name, categoryId : new ObjectId("67d15bf94fada66e9cd56f0e"), description
    }
    
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
    //Xư lý xóa ảnh deleteImages
    if(_deleteImages.length > 0){
      _deleteImages.map(image => deleteImageFunction(image.keyToDelete))
    }
    
    //
    if (req.files && req.files.length > 0) {//Có upload mới
      imagePaths = req.files.map((file,index) =>({
        imageAbsolutePath:`${req.protocol}://${req.get("host")}/uploads/${file.filename}`,
        fileName: file.filename,
        keyToDelete : path.join(__dirname, "..",file.path),
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

    const result = await pesticideModel.findByIdAndUpdate(id, updateData, { new: true });

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

module.exports.DeletePesticide = async (req, res) => {
  const response = new BaseResponse();
  try {
    const { id } = req.params; // Lấy ID từ URL params
    //Tìm & kiểm tra có tồn tại ảnh ko?

    //Xóa ảnh 

    //Xóa pesticide
    const result = await pesticideModel.findByIdAndDelete(id);

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

module.exports.ImportPesticides = async (req, res) => {
  const response = new BaseResponse();
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    let { fromRow = 1, toRow = 1 } = req.body;
    var failedItems=[]
    var successCount = 0;
    // Đọc file Excel
    const workbook = xlsx.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    // Lấy phạm vi dữ liệu trong sheet
    const range = xlsx.utils.decode_range(sheet["!ref"]);

    // Mặc định nếu không truyền fromRow/toRow
    fromRow = fromRow ? parseInt(fromRow) : range.s.r + 1;
    toRow = toRow ? parseInt(toRow) : range.e.r;

    if (fromRow < range.s.r + 1 || toRow > range.e.r || fromRow > toRow) {
      return res.status(400).json({ message: "Invalid row range" });
    }


    // Đọc từng dòng trong phạm vi từ fromRow đến toRow
    var newData = {}
    for (let rowNum = fromRow; rowNum <= toRow; rowNum++) {
      const row = {
        name: sheet[xlsx.utils.encode_cell({ r: rowNum, c: 0 })]?.v,
        description: sheet[xlsx.utils.encode_cell({ r: rowNum, c: 1 })]?.v,
        //categoryId: sheet[xlsx.utils.encode_cell({ r: rowNum, c: 2 })]?.v || null,
        images: [],
      };

      // Kiểm tra dữ liệu hợp lệ trước khi thêm vào DB
      newData = {...row, categoryId: new ObjectId(row.categoryId)}
      if (newData.name) {
        try {
          await pesticideModel.create(newData);
          successCount++;
        } catch (error) {
          failedItems.push({ newData, error: error.message });
        }
      } else {
        failedItems.push({ newData, error: "Required field" });
      }
    }

    // Xóa file sau khi xử lý
    fs.unlinkSync(req.file.path);

    var URL_dowloadFailed = exportToExcel(req,failedItems)

    response.success = true;
    response.message = "Import  thành công!";
    response.data={
      successCount: successCount,
      failed: failedItems.length,
      failedItems,
      URL_dowloadFailed : URL_dowloadFailed,
    }
    res.json(response);
  } catch (error) {
    response.success = false;
    response.message = error.toString();
    res.status(500).json(response);
  }
};


module.exports.ExportWithFilter = async (req, res) => {
  const response = new BaseResponse();
  try {
    var URL_dowload ="";
    const { keySearch, categoryId = null, page = 1, pageSize = 10, sortField = "createdAt", sortOrder = "desc", sortOptions } = req.body;

    // Tạo bộ lọc tìm kiếm
    const filter = {};
    if (keySearch) {
      filter.$or = [
        { name: { $regex: keySearch, $options: "i" } },
        { description: { $regex: keySearch, $options: "i" } },
      ];
    }
    // Nếu categoryId có giá trị hợp lệ, thêm vào filter
    if (categoryId && ObjectId.isValid(categoryId)) {
      filter.categoryId = new ObjectId(categoryId);
    }

    const data = await pesticideModel.aggregate([
      { $match: filter },
      {
        $lookup: {
          from: "categories",
          localField: "categoryId",
          foreignField: "_id",
          as: "category",
        },
      },
      { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } }, // Giải nén category
      {
        $project: {
          name: 1,
          description: 1,
          categoryId: 1,
        },
      },
      { $sort: sortOptions || { _id: 1 } },
    ]);

    URL_dowload = exportToExcel(req, data)    

    response.success = true;
    response.message = "Export  thành công!";
    response.data = URL_dowload
    res.json(response);
  } catch (error) {
    response.success = false;
    response.message = error.toString();
    res.status(500).json(response);
  }
};

module.exports.ExportAllPesticide = async (req, res) => {
  const response = new BaseResponse();
  try {
    var URL_dowload ="";
    const data = await pesticideModel.find().sort({ _id: 1 }).exec();
    
    URL_dowload = exportToExcel(req,data)    

    response.success = true;
    response.message = "Export  thành công!";
    response.data = URL_dowload
    res.json(response);
  } catch (error) {
    response.success = false;
    response.message = error.toString();
    res.status(500).json(response);
  }
};



function exportToExcel(req,data) {
  if(data?.length == 0){
    return ""
  }
  var result = ""
  // const EXPORT_DIR = path.join(__dirname, "..","exports");
  // if (!fs.existsSync(EXPORT_DIR)) {
  //   fs.mkdirSync(EXPORT_DIR);
  // } 
  const EXPORT_DIR = path.resolve(__dirname, "..", "exports");

  if (!fs.existsSync(EXPORT_DIR)) {
      fs.mkdirSync(EXPORT_DIR, { recursive: true });
  }
  
  try {
    const fileName = `ExportPesticide_${Date.now()}.xlsx`;
    const filePath = path.join(EXPORT_DIR, fileName);
  
    // Header tùy chỉnh
    const worksheet = xlsx.utils.aoa_to_sheet([
      ["Tên sản phẩm", "Mô tả", "Mã danh mục"], // Header
    ]);
  
    // Thêm dữ liệu vào sheet
    const dataRows = data.map((item) => [item.name, item.description, item.categoryId]);
    xlsx.utils.sheet_add_aoa(worksheet, dataRows, { origin: "A2" });
  
    // Tạo workbook và ghi file
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    xlsx.writeFile(workbook, filePath);    
    result = `${req.protocol}://${req.get("host")}/exports/${fileName}`
  } catch (error) {
    return result
  }
  return  result;
}

function filterRemainingImages(oldImages, deleteImages, key = "id") {
  return oldImages.filter(item => !deleteImages.some(del => del[key] === item[key]));
}

const deleteImageFunction = (relativePath) => {//keyToDelete
  
  fs.unlink(relativePath, (err) => {
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













