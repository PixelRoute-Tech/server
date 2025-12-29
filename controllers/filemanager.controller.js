const path = require("path");
const { fetchFolderTree,deleteIfExists } = require("../utils/files");

exports.getAllUploadedFiles = async (req, res) => {
  try {
    const uploadPath = path.resolve(__dirname, "../uploads");
    const result = await fetchFolderTree(uploadPath, "/uploads");
    res.success({ status: 200, data: result });
  } catch (error) {
    console.error("getAllUploadedFiles =>", error);
    res.error({ status: 500 });
  }
};

exports.deleteFile = async (req, res) => {
  try {
    const { path } = req.body;
    await deleteIfExists(path)
    res.success({ status: 200 });
  } catch (error) {
    console.log("deleteFile = ",error)
    res.success({ status: 500, error });
  }
};
