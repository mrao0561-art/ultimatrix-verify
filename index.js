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
        background:#070B14;
        color:white;
        font-family:sans-serif;
        display:flex;
        justify-content:center;
        align-items:center;
        height:100vh;
        overflow:hidden;
    ">

    <div style="
        position:absolute;
        width:600px;
        height:600px;
        background:#0099FF;
        filter:blur(220px);
        opacity:0.25;
    ">
    </div>

    <div style="
        position:relative;
        background:rgba(255,255,255,0.05);
        border:1px solid rgba(255,255,255,0.1);
        backdrop-filter:blur(20px);
        padding:55px;
        border-radius:35px;
        text-align:center;
        width:450px;
        box-shadow:0 0 60px rgba(0,153,255,0.35);
    ">

        <h1 style="
            font-size:45px;
            margin-bottom:15px;
            color:#FFFFFF;
        ">
            🔐 Verify Required
        </h1>

        <p style="
            color:#B9BBBE;
            line-height:1.8;
            margin-bottom:35px;
            font-size:17px;
        ">
            Welcome to Ultimatrix
            <br><br>
            This server requires verification before accessing all channels.
            <br><br>
            Click the button below to securely authenticate your Discord account.
        </p>

        <img
        src="https://cdn.discordapp.com/attachments/1441840450666496060/1506034398540202035/IMG_1824.gif?ex=6a0ccb55&is=6a0b79d5&hm=cd870c65394d739ae575ef95a894232c4b0d7cc739a643b604d913eaaab4160e&"
        style="
            width:100%;
            border-radius:20px;
            margin-bottom:30px;
            box-shadow:0 0 30px rgba(0,153,255,0.35);
        "
        >

        <a href="${url}">
            <button style="
                background:#0099FF;
                border:none;
                padding:18px 45px;
                color:white;
                border-radius:16px;
                cursor:pointer;
                font-size:20px;
                font-weight:bold;
                transition:0.3s;
                box-shadow:0 0 35px rgba(0,153,255,0.45);
            ">
                🔵 Verify Securely
            </button>
        </a>

        <p style="
            margin-top:25px;
            color:#7F848E;
            font-size:14px;
        ">
            Made By Eren Wavy and Mohit Yadav
        </p>

    </div>

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
            background:#070B14;
            color:white;
            display:flex;
            justify-content:center;
            align-items:center;
            height:100vh;
            font-family:sans-serif;
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

app.listen(3000, '0.0.0.0', () => {
    console.log('🚀 Website Running');
});
