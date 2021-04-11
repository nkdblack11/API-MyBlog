// const express = require('express');
// const axios = require('axios');
// const qs = require('qs');
// const app = express();
//
// const googleUri = "https://accounts.google.com/o/oauth2/v2/auth?";
// const accessType = "offline";
// const scope = "openid%20profile%20email";
// const responseType = "code";
//
//
// const oauthUrl = "https://oauth2.googleapis.com/token";
//
// app.get('/auth/google', function (req, res) {
//     let uri = googleUri;
//     uri += `access_type=${accessType}`;
//     uri += `&scope=${scope}`;
//     uri += `&response_type=${responseType}`;
//     uri += `&client_id=${clientId}`;
//     uri += `&redirect_uri=${redirectUri}`;
//     return res.redirect(307, uri);
// });
//
// app.get('/back', async (req, res) => {
//     try {
//         const {code} = req.query;
//
//         // const form = new FormData();
//         // form.append('code', code);
//         // form.append('redirect_uri', redirectUri);
//         // form.append('grant_type', 'authorization_code');
//         // form.append('client_id', clientId);
//         // form.append('client_secret', clientSecret);
//
//         const form = {
//             code,
//             redirect_uri: redirectUri,
//             grant_type: 'authorization_code',
//             client_id: clientId,
//             client_secret: clientSecret,
//             response_mode: 'form_post'
//         };
//
//         const result = await axios.post(oauthUrl, qs.stringify(form), { headers: {'Content-Type': 'application/x-www-form-urlencoded'} });
//         const {data} = result;
//         console.log('Tokens: ', result.data);
//
//
//         const resultProfile = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo?alt=json', {headers: {Authorization: 'Bearer ' + data.access_token}});
//         console.log('profile: ', resultProfile.data);
//
//
//
//         return res.send("ok")
//     }catch (e) {
//         console.log("Error /back: ", e);
//         res.status(400).send("ERROR")
//     }
// });
//
// app.listen(4500, () => {
//     console.log("open port 4500");
// });
