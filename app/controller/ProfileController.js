const UserInfo = require('../../model/UserInfo');
const Jwt = require('../../unit/TokenProvider');

async function show(req, res) {
    try {
        let tokenFromClient = req.body.accessToken || req.headers.authorization;
        tokenFromClient = tokenFromClient.split(' ');
        const payload = Jwt.verifyToken(tokenFromClient[1]);
        if (!payload) return res.status(401).send();
        let userInfo = await UserInfo.findOne({user_uid: payload.uid});
        if (!userInfo) return res.status(400).send('You need to log in');
        return res.status(200).send(userInfo);
    } catch (err) {
        console.error(err);
        return res.status(500).send('server err');
    }
}

async function updateProfile(req, res) {
    try {
        let tokenFromClient = req.body.accessToken || req.headers.authorization;
        tokenFromClient = tokenFromClient.split(' ');
        const payload = Jwt.verifyToken(tokenFromClient[1]);
        if (!payload) return res.status(401).send('no right');
        const userInfo = await UserInfo.updateOne(
            {user_uid: payload.uid},
            {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                phone: req.body.phone,
                gender: req.body.gender,
                address: req.body.address
            }
        );
        if (!userInfo.nModified) {
            return res.status(400).send({
                "code": "",
                "message": "",
            })
        }
        return res.status(200).send('Update successfully!');
    } catch (err) {
        console.error(err);
        return res.status(500).send('server err')
    }
}



module.exports = {
    show,
    updateProfile,
};
