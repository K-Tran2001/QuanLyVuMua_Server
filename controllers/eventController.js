
const eventModel = require("../models/eventModel");
const BaseResponse = require('./BaseResponse');


module.exports.GetAllEvent = async (req, res) => {
  const response = new BaseResponse();
  try {
    const { fromDate, toDate } = req.body;

    const filter = {};

    // Nếu có fromDate và toDate thì lọc theo khoảng thời gian
    if (fromDate && toDate) {
      filter.start = { $gte: new Date(fromDate), $lte: new Date(toDate) };
    }

    // Truy vấn tất cả dữ liệu theo bộ lọc
    const data = await eventModel.find(filter);

    // Trả về kết quả cho frontend
    response.success = true;
    response.data = data;

    res.json(response);
  } catch (error) {
    response.success = false;
    response.message = error.toString();
    res.status(500).json(response);
  }
};




module.exports.SeachEvent = async (req, res) => {
  let response = new BaseResponse();
    try {
        const { id } = req.params; // Lấy ID từ URL params

        if (!id) {
            response.success = false;
            response.message = "id is required";
            return res.status(400).json(response);
        }

        const result = await eventModel.findById(id); // Tìm kiếm theo ID trong MongoDB

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


module.exports.CreateEvent = async (req, res) => {
  const response = new BaseResponse();
    try {
      
      const newData = req.body;
      //Truy vấn monggo
        const result = await eventModel.create(newData);
        if (!result) {
          response.success = false
          response.message='An error occurred during the execution, please try again.'
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

module.exports.UpdateEvent = async (req, res) => {
  const response = new BaseResponse();
  try {
    const { id } = req.params; // Lấy ID từ URL params
    const updateData = req.body; // Dữ liệu cập nhật

    const result = await eventModel.findByIdAndUpdate(id, updateData, { new: true });

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

module.exports.DeleteEvent = async (req, res) => {
  const response = new BaseResponse();
  try {
    const { id } = req.params; // Lấy ID từ URL params

    const result = await eventModel.findByIdAndDelete(id);

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

module.exports.GetTodayEvents = async (today , tomorrow) => {
  try {

      const events = await eventModel.find({
          start: { $gte: today, $lt: tomorrow }
      });

      if (events.length > 0) {
          return { success: true, data: events.map(event => ({title: event.title, data: null})) };
      }
      return { success: false, data: [] };
  } catch (error) {
      console.error("Error fetching today's events:", error);
      return { success: false, data: [] };
  }
};

// module.exports.GetTomorrowEvents = async () => {
//   try {
//       const today = new Date();
//       today.setHours(0, 0, 0, 0);

//       const tomorrow = new Date(today);
//       tomorrow.setDate(today.getDate() + 1);

//       const dayAfterTomorrow = new Date(tomorrow);
//       dayAfterTomorrow.setDate(tomorrow.getDate() + 1);

//       const events = await eventModel.find({
//           start: { $gte: tomorrow, $lt: dayAfterTomorrow }
//       });

//       if (events.length > 0) {
//         return { success: true, data: events.map(event => ({title: event.title, data: null})) };
//       }
//       return { success: false, data: [] };
//   } catch (error) {
//       console.error("Error fetching tomorrow's events:", error);
//       return { success: false, data: [] };
//   }
// };













