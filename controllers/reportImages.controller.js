const RecordImagesSchema = require("../models/RecordImage.model");
const { saveJsonFile } = require("../utils/saveFile");
const path =  require("path");

exports.addReportImage = async (req, res) => {
  try {
    const { jobId, recordId, worksheetId, imageUrl, description,imagePath,filename } = req.body;
    const imageRecord = new RecordImagesSchema({
      jobId,
      recordId,
      worksheetId,
      url: imageUrl,
      description,
      fileName:filename,
    });
    console.log(req.body);

    if (!imageRecord) {
      return res.error({ status: 400, message: "Can't save the image" });
    }
    const filePath = path.join("uploads/imagepath",`${filename}.json`)
    saveJsonFile(filePath,imagePath)
    // await imageRecord.save();
    return res.success({ status: 200, maessage: "Image saved successfully" });
  } catch (error) {
    console.log(error);
    return res.error({ status: 500 });
  }
};

exports.updateReportImage = async (req, res) => {
  try {
    const {id} = req.params
    const { imageUrl, description,imagePath,filename } = req.body;

    if (!imageRecord) {
      return res.error({ status: 400, message: "Can't save the image" });
    }
    const filePath = path.join("uploads/imagepath",`${filename}.json`)
    await saveJsonFile(filePath,imagePath)
    const data = await RecordImagesSchema.findByIdAndUpdate(
      id,
      {$set:{imageUrl,description,filename}}
    )
    if(!data){
       return res.error({status:500,message:"Failed to update image please try again"})
    }
    return res.success({ status: 200, maessage: "Image saved successfully" });
  } catch (error) {
    console.log(error);
    return res.error({ status: 500 });
  }
};

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
