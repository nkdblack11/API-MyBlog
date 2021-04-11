const authRouter = require('./Auth');
const profileRouter = require('./Profile');
const postRouter = require('./Post');
const uploadRouter = require('./UpLoadFile');

function router(app) {

    app.use('/auth', authRouter);

    app.use('/profile', profileRouter);

    app.use('/post', postRouter);

    app.use('/upload-file', uploadRouter);

}

module.exports = router;
