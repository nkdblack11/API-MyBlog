const express = require('express');
const router = express.Router();
const AuthController = require('../app/controller/AuthController');

router.post('/register', AuthController.register);

router.post('/login', AuthController.login);

router.delete('/logOut', AuthController.logOut);

router.get('/refreshToken', AuthController.refreshToken);

router.get('/google', AuthController.loginGoogle);

router.get('/gCallback', AuthController.callback);

router.get('/microsoft', AuthController.loginMicrosoft);

router.get('/mCallback', AuthController.mCallback);


module.exports = router;
