const Jwt = require('jsonwebtoken');
let privateKey = process.env.PRIVATE_KEY || 'my_secret_key';
privateKey = privateKey.replace(/\\\\n/g, '\n');
let publicKey = process.env.PUBLIC_KEY || 'my_secret_key';
publicKey = publicKey.replace(/\\\\n/g, '\n');
const Crypto = require('crypto');
const EXP = parseInt(process.env.EXP) || 900;

function createAccToken(uid) {
    return Jwt.sign(
        {
            uid: uid,
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + EXP
        },
        privateKey,
        {algorithm: 'HS256'}
    )
}


function createRefToken(toEncrypt) {
    const buffer = Buffer.from(toEncrypt);
    const encrypted = Crypto.publicEncrypt(publicKey, buffer);
    return encrypted.toString("base64");
}

function verifyToken(token) {
    return Jwt.verify(token, privateKey)
}

function decryptStringWithRsaPrivateKey(toDecrypt) {
    const buffer = Buffer.from(toDecrypt, "base64");
    const decrypted = Crypto.privateDecrypt(privateKey, buffer);
    return decrypted.toString("utf8");
}

function getToken(req, res) {
    try {
        let tokenFromClient = req.body.accessToken || req.headers.authorization;
        tokenFromClient = tokenFromClient.split(' ');
        const payload = verifyToken(tokenFromClient[1]);
        if (!payload) return res.status(401).send('no right');
        return payload;
    } catch (err) {
        console.log(err);
        return res.status(500).send();
    }
}


module.exports = {
    createAccToken,
    verifyToken,
    createRefToken,
    decryptStringWithRsaPrivateKey,
    getToken,
};
