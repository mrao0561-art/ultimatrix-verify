require('dotenv').config();

const express = require('express');
const axios = require('axios');

const {
    Client,
    GatewayIntentBits
} = require('discord.js');

const app = express();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.once('clientReady', () => {
    console.log(`✅ Logged in as ${client.user.tag}`);
});

client.login(process.env.TOKEN);





/* =========================
   VERIFY COMMAND
========================= */

client.on('messageCreate', async (message) => {

    if (message.author.bot) return;

    if (message.content === '!verify') {

        const url =
        `https://ultimatrix-verify-production.up.railway.app`;

        await message.channel.send(`
🔐 Verify Required

Click below to verify:
${url}
        `);

    }

});





/* =========================
   HOME PAGE
========================= */

app.get('/', (req, res) => {

    const url =
    `https://discord.com/oauth2/authorize?client_id=${process.env.CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(process.env.REDIRECT_URI)}&scope=identify`;

    res.send(`

<!DOCTYPE html>

<html>

<head>

<title>Ultimatrix Verify</title>

<style>

body{
margin:0;
background:#050816;
height:100vh;
display:flex;
justify-content:center;
align-items:center;
font-family:Arial;
overflow:hidden;
}

.card{
width:420px;
padding:50px;
border-radius:30px;
background:rgba(255,255,255,0.05);
backdrop-filter:blur(20px);
border:1px solid rgba(255,255,255,0.1);
box-shadow:0 0 40px rgba(0,153,255,0.2);
text-align:center;
color:white;
}

.title{
font-size:42px;
margin-bottom:15px;
font-weight:bold;
}

.desc{
color:#aaa;
line-height:1.7;
margin-bottom:30px;
}

.btn{
display:inline-block;
padding:18px 40px;
border-radius:15px;
background:linear-gradient(45deg,#0099ff,#7b2cff);
color:white;
font-size:20px;
font-weight:bold;
text-decoration:none;
}

.footer{
margin-top:25px;
font-size:14px;
color:#777;
}

</style>

</head>

<body>

<div class="card">

<div class="title">
🔐 Ultimatrix
</div>

<div class="desc">
Secure Discord Verification
</div>

<a class="btn" href="${url}">
Verify
</a>

<div class="footer">
Made By Eren Wavy and Mohit Yadav
</div>

</div>

</body>

</html>

`);

});





/* =========================
   CALLBACK
========================= */

app.get('/callback', async (req, res) => {

    const code = req.query.code;

    if (!code) {
        return res.send('No OAuth code found');
    }

    try {

        const tokenResponse = await axios.post(
            'https://discord.com/api/oauth2/token',

            new URLSearchParams({
                client_id: process.env.CLIENT_ID,
                client_secret: process.env.CLIENT_SECRET,
                grant_type: 'authorization_code',
                code: code,
                redirect_uri: process.env.REDIRECT_URI,
                scope: 'identify'
            }),

            {
                headers: {
                    'Content-Type':
                    'application/x-www-form-urlencoded'
                }
            }
        );

        const accessToken =
        tokenResponse.data.access_token;

        const userResponse =
        await axios.get(
            'https://discord.com/api/users/@me',
            {
                headers: {
                    Authorization:
                    `Bearer ${accessToken}`
                }
            }
        );

        const user =
        userResponse.data;

        console.log(
            'User Verified:',
            user.username
        );

        res.send(`

<h1 style="
background:#050816;
color:white;
height:100vh;
display:flex;
justify-content:center;
align-items:center;
font-family:Arial;
margin:0;
">
✅ Verification Complete
</h1>

`);

    } catch (err) {

        console.log(err.response?.data || err);

        return res.status(500).send(`

<h1 style="
background:#050816;
color:white;
height:100vh;
display:flex;
justify-content:center;
align-items:center;
font-family:Arial;
margin:0;
">
❌ Verification Failed
</h1>

`);

    }

});





/* =========================
   SERVER
========================= */

app.listen(process.env.PORT || 3000, () => {

    console.log('🚀 Website Running');

});
