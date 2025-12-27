const express = require('express');
const {commonFiles,reportFiles,deleteExistFile} = require("../config/multer.config")
const router = express.Router();
router.use("/users",commonFiles.single("file"),require("./users.route"))
router.use("/client",commonFiles.single("file"),require("./client.route"))
router.use("/job",commonFiles.single("file"),require("./job.routes"))
router.use("/worksheet",commonFiles.single("file"),require("./worksheet.route"))
router.use("/report",deleteExistFile,reportFiles.fields([{name:"file",maxCount:1},{name:"preview",maxCount:1}]),require("./reports.route"))
router.use("/masters",require("./masters.route"))
router.use("/settings",require("./settings.routes"))
router.use("/company",require("./company.routes"))
router.post("/dummy",require("../controllers/dummy.controller").dummyController)
router.use("/notification",require("./notification.routes"))
router.use("/admin",require("./admin/main.route"))
module.exports = router