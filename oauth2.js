// const express = require('express');
// const axios = require('axios');
// const qs = require('qs');
// const app = express();
//
// const microsoftUri = "https://login.microsoftonline.com/common/oauth2/v2.0/authorize?";
// const scope = "user.read%20mail.read";
// const responseType = "code";
// const oauthUrl = "https://login.microsoftonline.com/common/oauth2/v2.0/token";
//
//
//
//
//
//
// app.get('/auth/microsoft', function (req, res) {
//     let uri = microsoftUri;
//     uri += `&scope=${scope}`;
//     uri += `&response_type=${responseType}`;
//     uri += `&client_id=${clientId}`;
//     uri += `&redirect_uri=${redirectUri}`;
//     return res.redirect(307, uri);
// });
//
// app.get('/callback', async (req, res) => {
//     console.log(req.query);
//     try {
//         const {code} = req.query;
//
//         // const form = new FormData();
//         // form.append('code', code);
//         // form.append('redirect_uri', redirectUri);
//         // form.append('grant_type', 'authorization_code');
//         // form.append('client_id', clientId);
//         // form.append('client_secret', clientSecret);
//         // form.append('scope', scope);
//         // form.append('response_mode', 'form_post');
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
//
//
//         const result = await axios.post(oauthUrl,qs.stringify(form), { headers: {'Content-Type': 'application/x-www-form-urlencoded'} });
//         const {data} = result;
//         console.log('Tokens: ', result.data);
//
//
//         const resultProfile = await axios.get('https://graph.microsoft.com/v1.0/me', {headers: {Authorization: 'Bearer ' + data.access_token}});
//         console.log('profile: ', resultProfile.data);
//
//
//
//         return res.send("ok")
//     }catch (e) {
//         console.log("Error /callback: ", e);
//         res.status(400).send("ERROR")
//     }
// });
//
//
//
// app.listen(4500, () => {
//     console.log("open port 4500");
// });
