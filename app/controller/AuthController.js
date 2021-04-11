const User = require('../../model/User');
const Token = require('../../model/Token');
const UserInfo = require('../../model/UserInfo');
const bcrypt = require('bcryptjs');
const {v4: uuidv4} = require('uuid');
const Jwt = require('../../unit/TokenProvider');
const axios = require('axios');
const qs = require('qs');

const Expired = process.env.EXPIRED;
const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleRedirectUri = process.env.GOOGLE_REDIRECT_URI;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
const googleUri = "https://accounts.google.com/o/oauth2/v2/auth?";
const accessType = "offline";
const scope = "openid%20profile%20email";
const googleResponseType = "code";
const googleOauthUrl = "https://oauth2.googleapis.com/token";

const microsoftClientId = process.env.MICROSOFT_CLIENT_ID;
const microsoftRedirectUri = process.env.MICROSOFT_REDIRECT_URI;
const microsoftClientSecret = process.env.MICROSOFT_CLIENT_SECRET;
const microsoftUri = "https://login.microsoftonline.com/common/oauth2/v2.0/authorize?";
const microsoftScope = "user.read%20mail.read";
const microsoftResponseType = "code";
const microsoftOauthUrl = "https://login.microsoftonline.com/common/oauth2/v2.0/token";

async function register(req, res) {
    try {
        let newUsername = await User.findOne({username: req.body.username});
        if (newUsername) return res.status(400).send({
            "code": "E_VALIDATION",
            "message": "Account already exists",
        });
        let hashedPassword = bcrypt.hashSync(req.body.password, 10);
        const user = await User.create({
            user_uid: uuidv4(),
            username: req.body.username,
            password: hashedPassword,
        });
        await UserInfo.create({
            id: uuidv4(),
            user_uid: user.user_uid,
        });
        let uidToken = uuidv4();
        let data = uidToken + '.' + user.user_uid;
        let accessToken = Jwt.createAccToken(user.user_uid);
        let refreshToken = Jwt.createRefToken(data);
        await Token.create({
            uid: uidToken,
            user_uid: user.user_uid,
        });
        res.cookie('RefreshToken', refreshToken, {domain: null, httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 365});
        return res.status(200).send({accessToken})

    } catch (err) {
        console.log(err);
        return res.status(400).send('Register fail!')
    }
}


async function login(req, res) {
    try {
        const user = await User.findOne({username: req.body.username, isActive: true});
        if (!user || !user.password) return res.status(401).send('The account does not exist or is locked!');
        let passwordIsValid = await bcrypt.compare(req.body.password, user.password);
        if (!passwordIsValid) return res.status(401).send('Incorrect password');
        let uidToken = uuidv4();
        let data = uidToken + '.' + user.user_uid;
        let accessToken = Jwt.createAccToken(user.user_uid);
        let refreshToken = Jwt.createRefToken(data);
        await Token.create({
            uid: uidToken,
            user_uid: user.user_uid,
        });
        res.cookie('RefreshToken', refreshToken, {httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 365});
        return res.status(200).send({accessToken})
    } catch (err) {
        console.log(err);
        return res.status(401).send('Login fail!')
    }
}

function logOut(req, res) {
    res.clearCookie('RefreshToken', {
        path: '/'
    });
    res.status(200).json({success: true, message: 'User logged out successfully'})
}

function loginGoogle(req, res) {
    let uri = googleUri;
    uri += `access_type=${accessType}`;
    uri += `&scope=${scope}`;
    uri += `&response_type=${googleResponseType}`;
    uri += `&client_id=${googleClientId}`;
    uri += `&redirect_uri=${googleRedirectUri}`;
    return res.redirect(307, uri);
}

async function callback(req, res) {
    try {
        const {code} = req.query;
        const form = {
            code,
            redirect_uri: googleRedirectUri,
            grant_type: 'authorization_code',
            client_id: googleClientId,
            client_secret: googleClientSecret,
            response_mode: 'form_post'
        };
        const result = await axios.post(googleOauthUrl, qs.stringify(form), {headers: {'Content-Type': 'application/x-www-form-urlencoded'}});
        const {data} = result;
        const resultProfile = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo?alt=json', {headers: {Authorization: 'Bearer ' + data.access_token}});
        let user = await User.findOne({user_uid: resultProfile.data.sub});
        if (user) {
            let uidToken = uuidv4();
            let data = uidToken + '.' + user.user_uid;
            await Token.create({
                uid: uidToken,
                user_uid: user.user_uid,
            });
            const accessToken = Jwt.createAccToken(user.user_id);
            const refreshToken = Jwt.createRefToken(data);
            res.cookie('RefreshToken', refreshToken, {httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 365});
            return res.status(200).send({accessToken})
        }
        user = await User.create({
            user_uid: resultProfile.data.sub,
            username: null,
            password: null,
            login: 'Google',
        });
        await UserInfo.create({
            id: uuidv4(),
            user_uid: user.user_uid,
        });
        let uidToken = uuidv4();
        let dataBc = uidToken + '.' + user.user_uid;
        const accessToken = Jwt.createAccToken(user.user_uid);
        const refreshToken = Jwt.createRefToken(dataBc);
        res.cookie('RefreshToken', refreshToken, {httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 365});
        return res.status(200).send({accessToken})
    } catch (e) {
        console.log("Error /back: ", e);
        res.status(400).send("ERROR")
    }
}

function loginMicrosoft(req, res) {
    let uri = microsoftUri;
    uri += `&scope=${microsoftScope}`;
    uri += `&response_type=${microsoftResponseType}`;
    uri += `&client_id=${microsoftClientId}`;
    uri += `&redirect_uri=${microsoftRedirectUri}`;
    return res.redirect(307, uri);
}

async function mCallback(req, res) {
    try {
        const {code} = req.query;
        const form = {
            code,
            redirect_uri: microsoftRedirectUri,
            grant_type: 'authorization_code',
            client_id: microsoftClientId,
            client_secret: microsoftClientSecret,
            response_mode: 'form_post'
        };
        const result = await axios.post(microsoftOauthUrl, qs.stringify(form), {headers: {'Content-Type': 'application/x-www-form-urlencoded'}});
        const {data} = result;
        const resultProfile = await axios.get('https://graph.microsoft.com/v1.0/me', {headers: {Authorization: 'Bearer ' + data.access_token}});
        let user = await User.findOne({user_uid: resultProfile.data.id});
        if (user) {
            let uidToken = uuidv4();
            await Token.create({
                uid: uidToken,
                user_uid: user.user_uid,
            });
            const accessToken = Jwt.createAccToken(user.user_id);
            let data = uidToken + '.' + user.user_uid;
            const refreshToken = Jwt.createRefToken(data);
            res.cookie('RefreshToken', refreshToken, {httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 365});
            return res.status(200).send({accessToken: accessToken, refreshToken: refreshToken})
        }
        user = await User.create({
            user_uid: resultProfile.data.id,
            username: null,
            password: null,
            login: 'Microsoft',
        });
        await UserInfo.create({
            id: uuidv4(),
            user_uid: user.user_uid,
        });
        let uidToken = uuidv4();
        let dataBc = uidToken + '.' + user.user_uid;
        const accessToken = Jwt.createAccToken(user.user_uid);
        const refreshToken = Jwt.createRefToken(dataBc);
        res.cookie('RefreshToken', refreshToken, {httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 365});
        return res.status(200).send({accessToken: accessToken, refreshToken: refreshToken});
    } catch (e) {
        console.log("Error /callback: ", e);
        res.status(400).send("ERROR")
    }
}

async function refreshToken(req, res) {
    try {
        let token = Jwt.decryptStringWithRsaPrivateKey(req.cookies.RefreshToken);
        token = token.split('.');
        let userToken = await Token.findOne({uid: token[0]});
        if (!(userToken.user_uid === token[1]) && !(userToken.isRevoke === false)) return res.status(401).send('Refresh token fail!!');
        let date = new Date().getTime();
        let expired = Date.parse(userToken.createdAt) + parseInt(Expired);
        if (date > expired) return res.status(401).send('refreshToken expired');
        let newToken = Jwt.createAccToken(userToken.user_uid);
        return res.status(200).send({accessToken: newToken});
    } catch (err) {
        console.log(err);
        return res.status(401).send('Refresh token fail!');
    }
}

module.exports = {
    register,
    login,
    logOut,
    refreshToken,
    loginGoogle,
    callback,
    loginMicrosoft,
    mCallback,
};
