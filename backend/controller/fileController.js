const mongoose = require("mongoose");
const { Readable } = require("stream");
const { getBucket } = require("../config/gridfs");

// POST /api/files/upload — Upload file to GridFS
module.exports.uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file provided" });
    }

    const bucket = getBucket();
    const fileId = new mongoose.Types.ObjectId();

    const uploadStream = bucket.openUploadStream(req.file.originalname, {
      metadata: {
        uploadedAt: new Date(),
        contentType: req.file.mimetype,
      },
    });

    uploadStream.on("finish", () => {
      res.status(200).json({
        message: "File uploaded successfully",
        fileId: uploadStream.id || fileId,
        filename: req.file.originalname,
      });
    });

    uploadStream.on("error", (err) => {
      console.log("Upload error:", err);
      res.status(500).json({ message: "File upload failed" });
    });

    // Convert buffer to stream
    const readableStream = Readable.from(req.file.buffer);
    readableStream.pipe(uploadStream);
  } catch (err) {
    console.log("Upload error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/files/:fileId — Download/retrieve file from GridFS
module.exports.getFile = async (req, res) => {
  try {
    const fileId = req.params.fileId;

    if (!mongoose.Types.ObjectId.isValid(fileId)) {
      return res.status(400).json({ message: "Invalid file ID" });
    }

    const bucket = getBucket();
    const objectId = new mongoose.Types.ObjectId(fileId);

    const downloadStream = bucket.openDownloadStream(objectId);

    downloadStream.on("error", () => {
      res.status(404).json({ message: "File not found" });
    });

    res.setHeader("Content-Type", "image/jpeg");
    downloadStream.pipe(res);
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

    const bucket = getBucket();
    const objectId = new mongoose.Types.ObjectId(fileId);

    bucket.delete(objectId, (err) => {
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