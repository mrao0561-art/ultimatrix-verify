require('dotenv').config();

const express = require('express');
const axios = require('axios');

const {
    Client,
    GatewayIntentBits,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require('discord.js');

const app = express();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.login(process.env.TOKEN);

client.once('ready', () => {
    console.log(`✅ Logged in as ${client.user.tag}`);
});

client.on('messageCreate', async message => {

    if (message.author.bot) return;

    if (message.content === '!verify') {

        await message.delete();

        const embed = new EmbedBuilder()

        .setColor('#0099FF')

        .setTitle('🔐 Verify Required')

        .setDescription(`
# Welcome to Ultimatrix

This server requires **Verification** before accessing all channels.

Click the button below to securely authenticate your Discord account.

━━━━━━━━━━━━━━━━━━
⚡ Fast Verification  
🛡️ Advanced Security  
🚀 Instant Server Access
━━━━━━━━━━━━━━━━━━
`)

        .setImage('https://cdn.discordapp.com/attachments/1441840450666496060/1506034398540202035/IMG_1824.gif?ex=6a0ccb55&is=6a0b79d5&hm=cd870c65394d739ae575ef95a894232c4b0d7cc739a643b604d913eaaab4160e&')

        .setFooter({
            text: 'Made By Eren Wavy and Mohit Yadav'
        });

        const button = new ButtonBuilder()

        .setLabel('🔵 Verify Securely')

        .setStyle(ButtonStyle.Link)

        .setURL('https://ultimatrix-verify-production.up.railway.app');

        const row = new ActionRowBuilder()
        .addComponents(button);

        await message.channel.send({
            embeds: [embed],
            components: [row]
        });
    }
});

app.get('/', (req, res) => {

    const url =
    `https://discord.com/oauth2/authorize?client_id=${process.env.CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(process.env.REDIRECT_URI)}&scope=identify`;

    res.send(`

<body style="
margin:0;
overflow:hidden;
background:#050816;
font-family:Arial;
display:flex;
justify-content:center;
align-items:center;
height:100vh;
perspective:1200px;
">

<div id="cursor-glow"></div>

<style>

body::before{
content:'';
position:absolute;
width:200%;
height:200%;
background:
radial-gradient(circle at center,#00aaff22 0%,transparent 40%);
animation:rotate 20s linear infinite;
}

@keyframes rotate{
0%{transform:rotate(0deg);}
100%{transform:rotate(360deg);}
}

#cursor-glow{
position:fixed;
width:320px;
height:320px;
background:radial-gradient(circle,#00aaff55 0%,transparent 70%);
pointer-events:none;
transform:translate(-50%,-50%);
filter:blur(45px);
z-index:0;
transition:0.05s;
}

.card{
position:relative;
z-index:2;
width:520px;
padding:40px;
border-radius:30px;
background:rgba(255,255,255,0.05);
backdrop-filter:blur(25px);
border:1px solid rgba(255,255,255,0.1);
box-shadow:
0 0 30px rgba(0,170,255,0.2),
0 0 80px rgba(0,170,255,0.15);
text-align:center;
overflow:hidden;
transition:0.15s ease-out;
transform-style:preserve-3d;
}

.card::before{
content:'';
position:absolute;
inset:-2px;
border-radius:30px;
padding:2px;
background:linear-gradient(
45deg,
#00aaff,
#0066ff,
#00ffff,
#00aaff
);
background-size:400%;
animation:borderAnim 6s linear infinite;
-webkit-mask:
linear-gradient(#fff 0 0) content-box,
linear-gradient(#fff 0 0);
-webkit-mask-composite:xor;
}

@keyframes borderAnim{
0%{background-position:0% 50%;}
100%{background-position:400% 50%;}
}

h1{
color:white;
font-size:42px;
margin-bottom:15px;
}

p{
color:#b7c1d6;
line-height:1.8;
font-size:17px;
}

.verify-btn{
margin-top:25px;
background:linear-gradient(45deg,#0099ff,#00ccff);
border:none;
padding:18px 45px;
font-size:20px;
font-weight:bold;
border-radius:18px;
cursor:pointer;
color:white;
transition:0.15s ease-out;
position:relative;
box-shadow:0 0 25px rgba(0,170,255,0.4);
}

.verify-btn:hover{
box-shadow:
0 0 40px rgba(0,170,255,0.7),
0 0 80px rgba(0,170,255,0.3);
}

img{
width:100%;
border-radius:20px;
margin-top:25px;
box-shadow:0 0 40px rgba(0,170,255,0.25);
}

.footer{
margin-top:20px;
color:#7f8ba3;
font-size:14px;
}

</style>

<div class="card">

<h1>🔐 Verify Required</h1>

<p>
Welcome to <b>Ultimatrix</b>
<br><br>
Securely verify your Discord account to access all server channels.
</p>

<img src="https://cdn.discordapp.com/attachments/1441840450666496060/1506034398540202035/IMG_1824.gif?ex=6a0ccb55&is=6a0b79d5&hm=cd870c65394d739ae575ef95a894232c4b0d7cc739a643b604d913eaaab4160e&">

<br>

<a href="${url}">
<button class="verify-btn">
Verify Securely
</button>
</a>

<div class="footer">
Made By Eren Wavy and Mohit Yadav
</div>

</div>

<script>

const glow = document.getElementById('cursor-glow');

document.addEventListener('mousemove', (e) => {

    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';

    const card = document.querySelector('.card');
    const rect = card.getBoundingClientRect();

    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    card.style.transform = \`
        rotateY(\${x / 25}deg)
        rotateX(\${-y / 25}deg)
        translateY(-8px)
    \`;
});

document.addEventListener('mouseleave', () => {

    const card = document.querySelector('.card');

    card.style.transform = \`
        rotateY(0deg)
        rotateX(0deg)
        translateY(0px)
    \`;
});

const btn = document.querySelector('.verify-btn');

btn.addEventListener('mousemove', (e) => {

    const rect = btn.getBoundingClientRect();

    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    btn.style.transform = \`
        translate(\${x / 8}px, \${y / 8}px)
        scale(1.08)
    \`;
});

btn.addEventListener('mouseleave', () => {

    btn.style.transform = \`
        translate(0px,0px)
        scale(1)
    \`;
});

</script>

</body>

    `);
});

app.get('/callback', async (req, res) => {

    const code = req.query.code;

    try {

        const tokenRes = await axios.post(
            'https://discord.com/api/oauth2/token',

            new URLSearchParams({
                client_id: process.env.CLIENT_ID,
                client_secret: process.env.CLIENT_SECRET,
                grant_type: 'authorization_code',
                code,
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
        tokenRes.data.access_token;

        const userRes = await axios.get(
            'https://discord.com/api/users/@me',
            {
                headers: {
                    Authorization:
                    `Bearer ${accessToken}`
                }
            }
        );

        const user = userRes.data;

        const guild =
        await client.guilds.fetch(
            process.env.GUILD_ID
        );

        const member =
        await guild.members.fetch(user.id);

        await member.roles.add(
            process.env.VERIFY_ROLE_ID
        );

        res.send(`
        <body style="
            margin:0;
            background:#050816;
            color:white;
            display:flex;
            justify-content:center;
            align-items:center;
            height:100vh;
            font-family:Arial;
        ">

        <div style="
            background:rgba(255,255,255,0.05);
            padding:60px;
            border-radius:30px;
            text-align:center;
            border:1px solid rgba(255,255,255,0.1);
            box-shadow:0 0 50px rgba(0,153,255,0.25);
        ">

            <h1 style="
                font-size:48px;
                color:#00B0FF;
                margin-bottom:20px;
            ">
                ✅ Verification Complete
            </h1>

            <p style="
                color:#B9BBBE;
                font-size:18px;
                line-height:1.7;
            ">
                Your Discord account has been successfully verified.
                <br><br>
                You can now return to the server and access all channels.
            </p>

        </div>

        </body>
        `);

    } catch(err) {

        console.log(err);

        res.send('Verification Failed');
    }
});

app.listen(process.env.PORT || 3000, () => {
    console.log('🚀 Website Running');
});
