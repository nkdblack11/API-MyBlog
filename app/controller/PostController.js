const Post = require('../../model/Post');
const Jwt = require('../../unit/TokenProvider');
const {v4: uuidv4} = require('uuid');

async function showAll(req, res) {
    try {
        let ports = await Post.find({});
        if (!ports) return res.status(400).send('null');
        return res.send(ports);
    } catch (err) {
        console.log(err);
        return res.status(500).send('Server Error')
    }
}

async function showByUserUid(req, res) {
    try {
        let posts = await Post.find({user_uid: req.params.userUid});
        return res.send(posts);
    } catch (err) {
        console.log(err);
        return res.status(500).send('Server Error');
    }
}

async function showById(req, res) {
    try {
        let ports = await Post.findOne({id: req.params.id});
        if (!ports) return res.status(400).send('null');
        return res.send(ports);
    } catch (err) {
        console.log(err);
        return res.status(500).send('Server Error');
    }
}

async function createPost(req, res) {
    try {
        const payload = Jwt.getToken(req, res);
        if (!payload) return res.status(401).send('No right');
        const post = await Post.create({
            id: uuidv4(),
            user_uid: payload.uid,
            title: req.body.title,
            content: req.body.content,
            images: req.body.images,
            tag: req.body.tag,
        });
        return res.send(post);
    } catch (err) {
        console.log(err);
        return res.status(500).send('Server error')
    }
}

async function editPost(req, res) {
    try {
        console.log(req.params);
        const payload = Jwt.getToken(req, res);
        if (!payload) return res.status(401).send('No right');
        const post = await Post.findOne({id: req.params.id});
        if (!post) return res.status(400).send('Post dose not exist!');
        await Post.updateOne({id: req.params.id}, {
            title: req.body.title,
            images: req.body.image,
            tag: req.body.tag,
            content: req.body.content,
        });
        return res.send(post);
    } catch (err) {
        console.log(err);
        return res.status(500).send('Server error');
    }

}

async function deletePostById(req, res) {
    try {
        const payload = Jwt.getToken(req, res);
        console.log(payload);
        if (!payload) return res.status(401).send('No right');
        const post = await Post.findOne({id: req.body.id});
        if (!post) return res.status(400).send('Post does not exist!');
        await Post.deleteOne({id: req.body.id});
        return res.send('Delete post successfully');
    } catch (err) {
        console.log(err);
        res.status(500).send('Server error');
    }
}

async function comment(req, res) {
    try {
        const payload = Jwt.getToken(req, res);
        if (!payload) return res.status(401).send('No right');
        const post = await Post.findOne({id: req.body.id});
        if (!post) return res.status(400).send('Post does not exist!');
        await Post.updateOne({id: req.body.id}, {comment: req.body.comment});
        return res.send('Comment successfully')
    } catch (err) {
        console.log(err);
        return res.status(500).send('Server error');
    }
}

module.exports = {
    showAll,
    showById,
    showByUserUid,
    createPost,
    editPost,
    deletePostById,
    comment,
};
