const express = require('express');
const router = express.Router()
router.use("/file-manager",require("./files.route"))
router.use("/company-master",require("./company.routes"))
module.exports = router