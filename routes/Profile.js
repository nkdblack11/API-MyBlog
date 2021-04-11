const express = require('express');
const router = express.Router();
const ProfileController = require('../app/controller/ProfileController');

router.put('/update', ProfileController.updateProfile);

router.get('/', ProfileController.show);

module.exports = router;
