const uploadSingleImage = (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    const filePath = `/uploads/${req.file.filename}`;
    res.json({ message: "File uploaded successfully!", filePath });
  };
  
const uploadMultipleImages = (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: "No files uploaded" });
  }

  const filePaths = req.files.map(file => `/uploads/${file.filename}`);
  res.json({ message: "Files uploaded successfully!", filePaths });
};
  
  module.exports = {
    uploadSingleImage,
    uploadMultipleImages,
  };
  