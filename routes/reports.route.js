const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.middleware');
const worksheetReport = require('../controllers/worksheetfile.controller');
const reportImages = require('../controllers/reportImages.controller');
router.get("/worksheet",auth,worksheetReport.generateWorksheetPdf)
router.post("/report-image",auth,reportImages.addReportImage)
router.get("/report-image/:id",auth,reportImages.getReportImages)
module.exports = router;