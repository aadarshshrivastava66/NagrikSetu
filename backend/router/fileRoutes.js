const express = require("express");
const router = express.Router();
const upload = require("../middleware/fileUpload");
const { uploadFile, getFile, deleteFile } = require("../controller/fileController");
const { isLogedIn } = require("../middleware/authmiddleware");

router.post("/upload", isLogedIn, upload.single("file"), uploadFile);  // Upload
router.get("/:fileId", getFile);                                      // Download
router.delete("/:fileId", isLogedIn, deleteFile);                       // Delete

module.exports = router;