const mongoose = require("mongoose");
const { getGFS } = require("../config/gridfs");

// POST /api/files/upload — Upload file to GridFS
module.exports.uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file provided" });
    }

    const gfs = getGFS();

    // Create write stream to GridFS
    const writeStream = gfs.createWriteStream({
      filename: `${Date.now()}-${req.file.originalname}`,
      contentType: req.file.mimetype,
    });

    // Write file to GridFS
    writeStream.on("close", (file) => {
      res.status(200).json({
        message: "File uploaded successfully",
        fileId: file._id,
        filename: file.filename,
      });
    });

    writeStream.on("error", (err) => {
      console.log("Upload error:", err);
      res.status(500).json({ message: "File upload failed" });
    });

    // Write buffer to stream
    writeStream.write(req.file.buffer);
    writeStream.end();
  } catch (err) {
    console.log("Upload error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/files/:fileId — Download/retrieve file from GridFS
module.exports.getFile = async (req, res) => {
  try {
    const fileId = req.params.fileId;

    // Check if valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(fileId)) {
      return res.status(400).json({ message: "Invalid file ID" });
    }

    const gfs = getGFS();

    // Find the file
    gfs.exist({ _id: fileId }, (err, found) => {
      if (err || !found) {
        return res.status(404).json({ message: "File not found" });
      }

      // Create read stream
      const readStream = gfs.createReadStream({ _id: fileId });

      // Set content type
      readStream.on("data", (chunk) => {
        if (!res.headersSent) {
          res.setHeader("Content-Type", "image/jpeg");
        }
      });

      readStream.on("error", () => {
        res.status(500).json({ message: "Error retrieving file" });
      });

      // Pipe to response
      readStream.pipe(res);
    });
  } catch (err) {
    console.log("Get file error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE /api/files/:fileId — Delete file from GridFS
module.exports.deleteFile = async (req, res) => {
  try {
    const fileId = req.params.fileId;

    if (!mongoose.Types.ObjectId.isValid(fileId)) {
      return res.status(400).json({ message: "Invalid file ID" });
    }

    const gfs = getGFS();

    gfs.remove({ _id: fileId }, (err) => {
      if (err) {
        return res.status(500).json({ message: "Error deleting file" });
      }
      res.status(200).json({ message: "File deleted successfully" });
    });
  } catch (err) {
    console.log("Delete file error:", err);
    res.status(500).json({ message: "Server error" });
  }
};