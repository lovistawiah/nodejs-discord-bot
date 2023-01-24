require('dotenv').config()
const { Client, GatewayIntentBits, PermissionsBitField } = require('discord.js');
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.MessageContent
    ]
});



client.once('ready', () => {
    console.log(`${client.user.tag} has logged in `)
})


client.on('messageCreate', async (message) => {
    // checking for kick members permission

    const PREFIX = "$"
    if (message.author.bot) return;
    if (message.content.startsWith(PREFIX)) {
        const [CMD_NAME, ...args] = message.content
            .trim()
            .substring(PREFIX.length)
            .split(/\s+/);
        if (CMD_NAME === 'kick') {
            if (!message.guild.members.me.permissions.has(PermissionsBitField.Flags.KickMembers)) {
                message.channel.send('You do not have permission to kick members')
            }
            if (args.length === 0) {
                return message.reply('Please provide an ID');
            }
            try {
                // ? fetch user id from message and await
                const member = await message.guild.members.fetch(args[0])
                // ! kicking user from channel
                member.kick();
            } catch (err) {
                //showing direct error in console
                message.channel.send(err.rawError.message)
            }

        } else if (CMD_NAME === 'ban') {
            if (!message.guild.members.me.permissions.has(PermissionsBitField.Flags.KickMembers)) {
                return message.channel.send('You do not have permission to ban members')
            } else {
                if (args.length === 0) {
                    return message.reply('Please provide an ID');
                }
                try {
                    const user = await message.guild.members.ban(args[0])
                    console.log(`${user} banned from channel`)
                } catch (err) {
                    message.channel.send(err.rawError.message)
                }
            }
        }
    }
});

client.on('messageReactionAdd', (reaction, user) => {

})

client.login(process.env.DISCORD_BOT);



