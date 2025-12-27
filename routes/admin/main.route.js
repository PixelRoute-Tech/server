const express = require('express');
const router = express.Router()
router.use("/file-manager",require("./files.route"))
module.exports = router