const express = require('express');
const router = express.Router()
const fileManager = require("../../controllers/filemanager.controller")
router.get("/",fileManager.getAllUploadedFiles)
module.exports = router