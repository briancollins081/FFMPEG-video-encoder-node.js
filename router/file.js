const express = require('express');

const fileController = require('../controller/file');
const { videoUploadMiddleware } = require('../middleware/fileupload');

const router = express.Router();

router.post('/uploads', [videoUploadMiddleware], fileController.uploadFile)
router.delete('/uploads/:fileId', fileController.deleteUploadedFile)
router.get('/uploads', fileController.listAllFiles)

module.exports = router;