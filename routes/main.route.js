const express = require('express');
const {commonFiles,reportFiles} = require("../config/multer.config")
const router = express.Router();
router.use("/users",commonFiles.single("file"),require("./users.route"))
router.use("/client",commonFiles.single("file"),require("./client.route"))
router.use("/job",commonFiles.single("file"),require("./job.routes"))
router.use("/worksheet",commonFiles.single("file"),require("./worksheet.route"))
router.use("/report",reportFiles.single("file"),require("./reports.route"))
router.use("/masters",require("./masters.route"))
router.use("/settings",require("./settings.routes"))
router.use("/company",require("./company.routes"))
router.post("/dummy",require("../controllers/dummy.controller").dummyController)
router.use("/notification",require("./notification.routes"))
module.exports = router