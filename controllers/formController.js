
const formModel = require("../models/formModel");
const BaseResponse = require('./BaseResponse');






module.exports.GetAllForm = async (req, res) => {
  const response = new BaseResponse();
    try {
      
      const {keySearch, page = 1, pageSize = 10 } = req.body;
      //Truy vấn monggo
      const filter = {};

      if (keySearch) {
          filter.$or = [
              { title: { $regex: keySearch, $options: 'i' } },
              { description: { $regex: keySearch, $options: 'i' } }
          ];
      }

      const totalForms = await formModel.countDocuments(filter);
      const forms = await formModel.find(filter)
          .skip((page - 1) * pageSize)
          .limit(parseInt(pageSize));

      // Trả về kết quả cho frontend
      response.success =true
      response.data = forms,
      response.metaData =  {
        totalRecords :totalForms,
        totalPages: Math.ceil(totalForms / pageSize),
        currentPage: parseInt(page),
        pageSize: parseInt(pageSize)
    }
      res.json( response );
    } catch (error) {
      response.success = false
      response.message=error.toString()
      res.status(500).json(response);
    }
};


module.exports.SeachForm = async (req, res) => {
  let response = new BaseResponse();
    try {
      const { id } = req.params;

        if (!id) {
            response.success = false;
            response.message = "formId is required";
            return res.status(400).json(response);
        }

        const form = await formModel.findById(id); // Tìm kiếm theo ID trong MongoDB

        if (!form) {
            response.success = false;
            response.message = "Form not found";
            return res.status(404).json(response);
        }

        response.data = form;
        response.message = "Form found successfully";
        res.json(response);
    } catch (error) {
        response.success = false;
        response.message = error.toString();
        response.data = null;
        res.status(500).json(response);
    }
};


module.exports.CreateOrUpdateForm = async (req, res) => {
  const response = new BaseResponse();
    try {
      
      const {usename,password} = req.body;
      //Truy vấn monggo
  

      // Trả về kết quả cho frontend
      res.json({ response });
    } catch (error) {
      response = {
        ...response,
        success:false,
        message:error.toString(),
        data:null
      }
      res.status(500).json(response);
    }
};



module.exports.CreateForm = async (req, res) => {
  const response = new BaseResponse();
    try {
      
      const newForm = req.body;
      //Truy vấn monggo
        const createForm = await formModel.create(newForm);
        if (!createForm) {
          response.success = false
          response.message='Có lỗi trong quá trình tạo form, vui lòng thử lại.'
          return res.json(response);
        }
        response.success = true
        response.data = createForm?._id
        res.json(response);
    } catch (error) {
      response.success = false
      response.message=error.toString()
      res.status(500).json(response);
    }
};

module.exports.UpdateForm = async (req, res) => {
  const response = new BaseResponse();
  try {
    const { id } = req.params; // Lấy ID từ URL params
    const updateData = req.body; // Dữ liệu cập nhật

    const result = await formModel.findByIdAndUpdate(id, updateData, { new: true });

    if (!result) {
      response.success = false;
      response.message = "No data found to update..";
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

module.exports.DeleteForm = async (req, res) => {
  const response = new BaseResponse();
  try {
    const { id } = req.params; // Lấy ID từ URL params
    //Tìm & kiểm tra có tồn tại ảnh ko?

    //Xóa ảnh 

    //Xóa garden
    const result = await formModel.findByIdAndDelete(id);

    if (!result) {
      response.success = false;
      response.message = "No data found to delete.";
      return res.json(response);
    }

    response.success = true;
    response.message = "Deleted successfully!";
    res.json(response);
  } catch (error) {
    response.success = false;
    response.message = error.toString();
    res.status(500).json(response);
  }
};

module.exports.PublishForm = async (req, res) => {
  const response = new BaseResponse();
  try {
    const { id } = req.params; // Lấy ID từ URL params
    const { domain } = req.body
    const updatedForm = await formModel.updateOne(
      { _id :id  },
      { $set: { status:"Publish", linkSubmitForm: `${domain}/forms/submit/${id}` } }
    );

    if (!updatedForm) {
      response.success = false;
      response.message = "No data found to update..";
      return res.json(response);
    }

    response.success = true;
    response.data = null;
    res.json(response);
  } catch (error) {
    response.success = false;
    response.message = error.toString();
    res.status(500).json(response);
  }
};












