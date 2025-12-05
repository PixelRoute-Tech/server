const RecordImagesSchema = require("../models/RecordImage.model");
const { saveJsonFile,deleteIfExists } = require("../utils/files");
const path = require("path");

exports.addReportImage = async (req, res) => {
  try {
    const {
      jobId,
      recordId,
      worksheetId,
      fileUrl,
      previewUrl,
      description,
      imagePath,
      filename,
    } = req.body;
    const imageRecord = new RecordImagesSchema({
      jobId,
      recordId,
      worksheetId,
      url: fileUrl,
      preview: previewUrl,
      description,
      fileName: filename,
    });
    console.log(req.body);

    if (!imageRecord) {
      return res.error({ status: 400, message: "Can't save the image" });
    }
    const filePath = path.join("uploads/imagepath", `${filename}.json`);
    saveJsonFile(filePath, imagePath);
    await imageRecord.save();
    return res.success({ status: 200, maessage: "Image saved successfully" });
  } catch (error) {
    console.log(error);
    return res.error({ status: 500 });
  }
};

exports.updateReportImage = async (req, res) => {
  try {
    const { id } = req.params;
    const { fileUrl, previewUrl, description, imagePath, filename } = req.body;

    const filePath = path.join("uploads/imagepath", `${filename[1]}.json`);
    await saveJsonFile(filePath, imagePath);
    const data = await RecordImagesSchema.findByIdAndUpdate(id, {
      $set: {
        url: fileUrl,
        preview: previewUrl,
        description,
        fileName: filename[1],
      },
    });
    console.log({
      url: fileUrl,
      preview: previewUrl,
      description,
      fileName: filename[1],
    });
    if (!data) {
      return res.error({
        status: 500,
        message: "Failed to update image please try again",
      });
    }
    return res.success({ status: 200, maessage: "Image saved successfully" });
  } catch (error) {
    console.log(error);
    return res.error({ status: 500 });
  }
};

exports.deleteReportImage = async (req,res)=>{
   try {
    const {id} = req.params
    const data = await RecordImagesSchema.findByIdAndDelete(id)
    if(!data){
       return res.error({status:500,message:"Cant delete the file !"})
    }
     const filePath = path.join("uploads/imagepath", `${data.fileName}.json`);
     deleteIfExists(filePath)
    return res.success({status:200,message:"Deleted successfully"})
   } catch (error) {
     console.log(error)
     res.error({ status: 500, error });
   }
}

exports.getReportImages = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await RecordImagesSchema.find({ recordId: id });
    if (!data) {
      res.error({ status: 400, message: "Failed to fetch images" });
    }
    res.success({ status: 200, data });
  } catch (error) {
    console.log(error);
    res.error({ status: 500, error });
  }
};
