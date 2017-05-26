const Discord = require('discord.js');
const RichEmbed = require('discord.js').RichEmbed
const bot = new Discord.Client();
const config = require('./config.json')

bot.on('ready', () => {});

function rule(sendto) {
    sendto.send('Welcome to **NateDev - Official**! \nYou must agree to the rules! \n*Rules:* \nThis is a public discord server. These rules always apply, and they can and will be changed by senior staff members at any time. Please abide by these rules at all times. \n:one: You may not have an inappropriate Discord username, profile picture or game. You will be asked 2 times to change it, and then will be kicked. \n:two: You may not use sexual, homophobic, or derogatory slurs. You will warned up to three times, then you will muted. \n:three: No threats are allowed, even if the user was okay with it. You will be instantly banned without any further notice. \n:four: You are not to post links to anything unrelated to Minecraft, Bukkit, Spigot, or Nate unless it is in #offtopic-and-bot-tests. You will be warned up to a couple of times. However, if it is an inappropriate, you will instantly kicked. \n:five: You are not to excessively use caps or spam characters. You will be warned up to a couple of times. \n:six: You are not to talk back or talk smack about staff members. Even if it was a joking matter, you will be warned, then muted. \n:seven: Keep swearing to a minimum, and keep your conversations PG-13. It is entirely unnecessary, and not everyone appreciates it. \n:eight: Keep advertisements for Minecraft servers, Discord servers, or any other service in #promote-yourself: \n:white_small_square: Only promote yourself or your services at most once every 24 hours. \n:white_small_square: Do not try and steal my requests / server members. ("My server is better than Nates!!") \n:white_small_square: Do not advertise paid products or paid services. \n:white_small_square: You must be at least level 5 to post any promotions. (-rank to check your level) \n:white_check_mark: If you believe any of these rules are unfair, please let me know in #discord-suggestions! \n \nIf you agree to these rules, please type `yes` in this DM. If not, type `no`')
}

exports.multiSendCode = (channel, messages, delay) => {
    delay = delay || 100;
    messages.forEach((m, i) => {
        setTimeout(() => {
            channel.send('\`\`\`js\n' + m + '\`\`\`');
        }, delay * i);
    });
};

exports.sendLarge = (channel, largeMessage, options = {}) => {
    let message = largeMessage;
    let messages = [];
    let prefix = options.prefix || '';
    let suffix = options.suffix || '';

    let max = 1989 - prefix.length - suffix.length;

    while (message.length >= max) {
        let part = message.substr(0, max);
        let cutTo = max;
        if (options.cutOn) {
            cutTo = part.lastIndexOf(options.cutOn);
            part = part.substr(0, cutTo);
        }
        messages.push(prefix + part + suffix);
        message = message.substr(cutTo);
    }

    if (message.length > 1) {
        messages.push(prefix + message + suffix);
    }

    this.multiSendCode(channel, messages, options.delay);
};

exports.clean = (text) => {
    if (typeof (text) === 'string') {
        return text.replace(/`/g, '`' + String.fromCharCode(8203)).replace(/@/g, '@' + String.fromCharCode(8203)).replace(config.token, 'BOT_TOKEN' + String.fromCharCode(8203));
    }
    else {
        return text;
    }
}

bot.on('guildMemberAdd', member => {
    rule(member);
});

bot.on('message', message => {
    if (bot.user === message.author) return;
    if (message.channel.type !== 'dm') return;
    if (bot.guilds.get(config.guildID).members.get(message.author.id).roles.get(config.roleID)) return;
    if (message.content.toLowerCase().includes('yes')) {
        bot.guilds.get(config.guildID).members.get(message.author.id).addRole(config.roleID).catch(console.error);
        message.channel.send(':white_check_mark: You are now verified on ' + bot.guilds.get(config.guildID).name + '.');
    } else if (message.content.toLowerCase().includes('no') && !message.author.roles) {
        bot.guilds.get(config.guildID).members.get(message.author.id).kick('You have been kicked because you did not agree to the rules!').catch(console.error);
        message.channel.send(':x: You were kicked from ' + bot.guilds.get(config.guildID).name + '.');
    }
});

bot.on('message', message =>{
    if (!message.content.startsWith(config.prefix)) return;
    if (message.author.bot) return;
    let command = message.content.split(' ')[0].slice(config.prefix.length);
    let args = message.content.split(' ').slice(1);
    if (command === 'help') {
        message.channel.send({
            embed: new RichEmbed()
            .addField(':wrench: Utility:', `\`${config.prefix}eval\`: Evaluates JavaScript code.`)
            .addField(':shield: Moderation:', `\`${config.prefix}unverify\`: Forces the user to read the rules again`)
        });
    }

    if (command === 'eval') {
        if (message.author.id === '263118500724342784' || '210762063021211649'){
            if (args.length < 1) {
                return message.channel.send(':x: Please provide code to evaluate!');
            }
            try {
                let evaled = eval(args.join(' '));
                let output = require('util').inspect(evaled);
                let clean = this.clean(output);
                this.sendLarge(message.channel, clean);
            } catch (err) {
                message.channel.send(`\`\`\`${err}\`\`\``);
            }
        }
    }

    if (command === 'unverify') {
        if (!message.member.hasPermission('KICK_MEMBERS')) return message.channel.send(':x: You need KICK_MEMBERS permission!');
        if (!message.mentions) {
            return message.channel.send(':x: Please mention a member!');
        }
        let user = message.guild.member(message.mentions.users.first());
        user.removeRole(config.roleID);
        rule(user);
        message.channel.send(':white_check_mark: Unverified user.').then(m => m.delete(5000));
    }
});

bot.login(config.token);
