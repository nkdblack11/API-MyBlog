const express = require('express');
const router = express.Router();
const UploadFile = require('../unit/UploadImg');

router.post('/uploadFile', UploadFile.uploadFile);

router.post('/uploadFiles', UploadFile.uploadFiles);

module.exports = router;
