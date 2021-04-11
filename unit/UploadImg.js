const multer = require('multer');

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '_' + file.originalname)
    }
});

let upload = multer({storage: storage}).single('image');

let uploads = multer({storage: storage}).array('file', 15);

function uploadFile(req, res) {
    try {
        upload(req, res, function (err) {
            if (err){
                return res.send('error uploading fail!');
            }
            console.log(req.file);
            let url = 'http://localhost:4000/images/' + req.file.filename;
            return res.send({image: url})
        });
    } catch (err) {
        console.error(err);
        return res.status(400).send('fail')
    }
}


function uploadFiles(req, res) {
    try {
        uploads(req, res, function (err) {
            if (err){
                console.log(err);
                return res.send('error uploading fail!');
            }
            let url = [];
            req.files.forEach(file => {
                url.push('http://localhost:4000/images/' + file.filename)
            });
            return res.send(url)
        });
    } catch (err) {
        console.error(err);
        return res.status(400).send('fail')
    }
}

module.exports = {
    uploadFile,
    uploadFiles,
};
