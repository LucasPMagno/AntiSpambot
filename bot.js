const Discord = require('discord.js');
const bot = new Discord.Client();
const config = require('./config.json')

bot.on('ready', () => {});

bot.on('guildMemberAdd', member => {
    member.send('Welcome to **NateDev - Official**!');
    member.send('The rules of this guild are:')
    member.send('This is a public discord server. These rules always apply, and they can and will be changed by senior staff members at any time. Please abide by these rules at all times.')
    member.send(':one: You may not have an inappropriate Discord username, profile picture or game. You will be asked 2 times to change it, and then will be kicked.')
    member.send(':two: You may not use sexual, homophobic, or derogatory slurs. You will warned up to three times, then you will muted.')
    member.send(':three: No threats are allowed, even if the user was okay with it. You will be instantly banned without any further notice.')
    member.send(':four: You are not to post links to anything unrelated to Minecraft, Bukkit, Spigot, or Nate unless it is in #offtopic-and-bot-tests. You will be warned up to a couple of times. However, if it is an inappropriate, you will instantly kicked. ')
    member.send(':five: You are not to excessively use caps or spam characters. You will be warned up to a couple of times.')
    member.send(':six: You are not to talk back or talk smack about staff members. Even if it was a joking matter, you will be warned, then muted.')
    member.send(':seven: Keep swearing to a minimum, and keep your conversations PG-13. It is entirely unnecessary, and not everyone appreciates it.')
    member.send(':eight: Keep advertisements for Minecraft servers, Discord servers, or any other service in #promote-yourself:')
    member.send(':white_small_square: Only promote yourself or your services at most once every 24 hours.')
    member.send(':white_small_square: Do not try and steal my requests / server members. ("My server is better than Nates!!")')
    member.send(':white_small_square: Do not advertise paid products or paid services.')
    member.send(':white_small_square: You must be at least level 5 to post any promotions. (-rank to check your level)')
    member.send(':white_check_mark: If you believe any of these rules are unfair, please let me know in #discord-suggestions!')
    member.send('If you agree to these rules, please type "yes" in this DM. If not, type "no"')
});

bot.on('message', message => {
    if (bot.user === message.author) return;
    if (message.channel.type !== 'dm') return;
    if (bot.guilds.find('id', config.guildID).members.get(message.author.id).roles.get(config.roleID)) return;
    if (message.content.includes('yes')) {
        bot.guilds.find('id', config.guildID).members.get(message.author.id).addRole(config.roleID);
    } else if (message.content.includes('no') && !message.author.roles) {
        bot.guilds.find('id', config.guildID).members.get(message.author.id).kick()
    }
});
bot.login(config.token);
