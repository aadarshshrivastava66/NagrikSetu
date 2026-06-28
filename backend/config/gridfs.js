const mongoose = require("mongoose");

let bucket;

const initGridFS = () => {
  const conn = mongoose.connection;
  bucket = new mongoose.mongo.GridFSBucket(conn.db);
  console.log("GridFS initialized");
};

const getBucket = () => {
  if (!bucket) {
    throw new Error("GridFS not initialized");
  }
  return bucket;
};

module.exports = { initGridFS, getBucket };