const Discord = require('discord.js');
const bot = new Discord.Client();
const config = require('./config.json')

bot.on('ready', () => {});

bot.on('guildMemberAdd', member => {
    member.send('aaaa');
});

bot.on('message', message => {
    if (bot.user === message.author) return;
    if (message.channel.type !== 'dm') return;
    if (message.content.includes('yes')) {
        console.log('1');
        bot.guilds.find('id', config.guildID).members.find('id', message.author.id).addRole(config.roleID);
    } else if (message.content.includes('no') && !message.author.roles) {
        bot.guilds.find('id', config.guildID).members.find('id', message.author.id).kick()
    }
});
bot.login(config.token);
