const express = require('express');
const router = express.Router();
const PostController = require('../app/controller/PostController');

router.get('/showALl', PostController.showAll);
router.get('/:id', PostController.showById);
router.get('/showPost/:userUid', PostController.showByUserUid);
router.post('/createPost', PostController.createPost);
router.post('/edit/:id', PostController.editPost);
router.delete('/deletePost', PostController.deletePostById);
router.post('/comment', PostController.comment);

module.exports = router;
