const Discord = require('discord.js');
const config = require('./config.json');
const fs = require('fs');
const { prefix } = require('./config.json');

const client = new Discord.Client({
    intents: ["GUILDS", "GUILD_MEMBERS", "GUILD_PRESENCES", "GUILD_INTEGRATIONS", "GUILD_VOICE_STATES", "GUILD_MESSAGES", "GUILD_MESSAGE_REACTIONS", "DIRECT_MESSAGES", "DIRECT_MESSAGE_REACTIONS"],
});

client.on('ready', () => {
    console.log(`Ready logged in as ${client.user.tag}`)
});

client.commands = new Discord.Collection();
client.config = config;
client.color = config.color;

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	// set a new item in the Collection
	// with the key as the command name and the value as the exported module
	client.commands.set(command.name, command);
}

client.on('messageCreate', async message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const command = args.shift().toLowerCase();

    if (!client.commands.has(command)) return;

	try {
		client.commands.get(command).execute(message, client, args);
	} catch (error) {
		console.error(error);
		message.reply('there was an error trying to execute that command!');
	}
});


client.login(config.token)