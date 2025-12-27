const fs = require("fs/promises");
const path = require("path");
const {fetchFolderTree} = require("../utils/files")
exports.getAllUploadedFiles = async (req, res) => {
  try {
    const uploadPath = path.resolve(__dirname, "../uploads");
    const result = await fetchFolderTree(uploadPath);

    console.log(result);
    res.success({ status: 200, data: result });
  } catch (error) {
    console.error("getAllUploadedFiles =>", error);
    res.error({ status: 500 });
  }
};
