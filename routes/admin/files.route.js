const express = require('express');
const router = express.Router()
const fileManager = require("../../controllers/filemanager.controller")
router.get("/",fileManager.getAllUploadedFiles)
router.delete("/",fileManager.deleteFile)
module.exports = router