const RecordImagesSchema = require("../models/RecordImage.model");

exports.addReportImage = async (req, res) => {
  try {
    const { jobId, recordId, worksheetId, imageUrl, description } = req.body;
    const imageRecord = new RecordImagesSchema({
      jobId,
      recordId,
      worksheetId,
      url: imageUrl,
      description,
    });
    console.log({
      jobId,
      recordId,
      worksheetId,
      url: imageUrl,
      description,
    });

    if (!imageRecord) {
      return res.error({ status: 400, message: "Can't save the image" });
    }
    await imageRecord.save();
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
