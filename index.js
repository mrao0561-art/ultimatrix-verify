require('dotenv').config();

const {
    Client,
    GatewayIntentBits
} = require('discord.js');

const express = require('express');
const axios = require('axios');

const app = express();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers
    ]
});

client.once('ready', () => {
    console.log(`✅ Logged in as ${client.user.tag}`);
});

client.login(process.env.TOKEN);





/* =========================
   HOME PAGE
========================= */

app.get('/', (req, res) => {

    const url =
    `https://discord.com/oauth2/authorize?client_id=${process.env.CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(process.env.REDIRECT_URI)}&scope=identify`;

    res.send(`

<!DOCTYPE html>

<html lang="en">

<head>

<meta charset="UTF-8">

<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>Ultimatrix Verify</title>

<style>

*{
margin:0;
padding:0;
box-sizing:border-box;
}

body{
height:100vh;
display:flex;
justify-content:center;
align-items:center;
background:#050816;
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
box-shadow:0 0 50px rgba(0,140,255,0.2);
text-align:center;
transition:0.2s;
position:relative;
}

.logo{
font-size:70px;
margin-bottom:20px;
}

.title{
font-size:42px;
font-weight:bold;
color:white;
margin-bottom:15px;
}

.desc{
font-size:17px;
color:#aaa;
line-height:1.7;
margin-bottom:35px;
}

.verify-btn{
display:inline-block;
padding:18px 40px;
background:linear-gradient(45deg,#0099ff,#7b2cff);
border-radius:15px;
font-size:20px;
font-weight:bold;
color:white;
text-decoration:none;
transition:0.2s;
position:relative;
overflow:hidden;
}

.verify-btn:hover{
transform:translateY(-5px) scale(1.03);
box-shadow:
0 0 30px rgba(0,153,255,0.6),
0 0 60px rgba(123,44,255,0.4);
}

.glow{
position:absolute;
width:400px;
height:400px;
background:radial-gradient(circle,
rgba(0,153,255,0.25),
transparent 70%);
pointer-events:none;
transform:translate(-50%,-50%);
mix-blend-mode:screen;
}

</style>

</head>

<body>

<div class="glow"></div>

<div class="card">

<div class="logo">🛡️</div>

<div class="title">
Ultimatrix Verify
</div>

<div class="desc">
Secure Discord verification system with smooth animations and glowing UI.
</div>

<a class="verify-btn" href="${url}">
Verify Now
</a>

</div>

<script>

const glow = document.querySelector('.glow');

document.addEventListener('mousemove', (e) => {

glow.style.left = e.clientX + 'px';
glow.style.top = e.clientY + 'px';

});

const card = document.querySelector('.card');

document.addEventListener('mousemove', (e) => {

const x =
(window.innerWidth / 2 - e.pageX) / 25;

const y =
(window.innerHeight / 2 - e.pageY) / 25;

card.style.transform =
'rotateY(' + x + 'deg) rotateX(' + y + 'deg)';

});

document.addEventListener('mouseleave', () => {

card.style.transform =
'rotateY(0deg) rotateX(0deg)';

});

</script>

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

<!DOCTYPE html>

<html>

<head>

<title>Verified</title>

<style>

body{
margin:0;
background:#050816;
color:white;
display:flex;
justify-content:center;
align-items:center;
height:100vh;
font-family:Arial;
overflow:hidden;
}

.box{
background:rgba(255,255,255,0.05);
padding:60px;
border-radius:30px;
text-align:center;
border:1px solid rgba(255,255,255,0.1);
box-shadow:
0 0 50px rgba(0,153,255,0.25);
}

.title{
font-size:48px;
color:#00B0FF;
margin-bottom:20px;
font-weight:bold;
}

.text{
color:#B9BBBE;
font-size:18px;
line-height:1.8;
}

</style>

</head>

<body>

<div class="box">

<div class="title">
✅ Verification Complete
</div>

<div class="text">

Your Discord account has been successfully verified.

<br><br>

You can now return to Discord.

</div>

</div>

</body>

</html>

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
        ">
        Verification Failed
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
