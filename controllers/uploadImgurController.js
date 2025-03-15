const axios = require("axios");
//require("dotenv").config();

const { IMGUR_CLIENT_ID } = process.env;


// Upload nhiều file lên Imgur
const uploadImgurMultipleFiles = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const uploadPromises = req.files.map(async (file) => {
      const imageBase64 = file.buffer.toString("base64");

      const response = await axios.post(
        "https://api.imgur.com/3/upload",
        { image: imageBase64, type: "base64" },
        { headers: { Authorization: `Client-ID ${IMGUR_CLIENT_ID}` } }
      );

      //return response.data.data.link;
      return response.data.data //deleteHash: response.data.data.deletehash
    });

    const uploadResults = await Promise.all(uploadPromises);

    var dataImages = uploadResults?.length > 0 ? uploadResults.map((item,index)=>({
      imageAbsolutePath: item.link,
      fileName: item.link.replace("https://i.imgur.com/", ""),
      keyToDelete : item.deletehash,
      imageBase64String: "",
      imageFile: null,
      isNewUpload:false,
      displayOrder:index
    })):[]

    res.json({
      message: "Files uploaded successfully",
      dataImages: dataImages,
    });
  } catch (error) {
    console.error("Upload error:", error.response?.data || error.message);
    res.status(500).json({ message: "Upload failed", error: error.message });
  }
};

const deleteImage = async(deleteHash)=>{//keyToDelete
  try {

    if (!deleteHash) {
      return res.status(400).json({ message: "Missing deleteHash" });
    }

    const response = await axios.delete(`https://api.imgur.com/3/image/${deleteHash}`, {
      headers: { Authorization: `Client-ID ${IMGUR_CLIENT_ID}` },
    });

    return ({
      succsess: true,
      data: response.data,
    })
  } catch (error) {
    return ({
      succsess: false,
      data: null,
    })
  }
}
  
  

module.exports = { uploadImgurMultipleFiles };
