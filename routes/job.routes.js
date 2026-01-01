const express = require('express');
const router = express.Router();
const auth = require("../middleware/auth.middleware")
const jobController = require("../controllers/job.controller")
const {multiFiles,attachFilePaths} = require("../config/multer.config")
// @route   POST api/client
// @desc    Register user
// @access  Public
router.post('/:id',auth,multiFiles.array("files",50),attachFilePaths,jobController.saveJobRequest);
router.get('/:id',auth,jobController.getJobRequests);
router.delete('/:id',auth,jobController.deleteJobRequest);
router.get('/details/:id',jobController.getJobDetails);
router.put('/:id',auth,multiFiles.array("files",50),attachFilePaths,jobController.updateJobRequest);
router.get('/user-jobs/:id',auth,jobController.getJobsByUser);
router.put('/user-jobs/:id',auth,jobController.updateJobStatus);

module.exports = router


