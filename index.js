const Discord = require('discord.js');
const config = require('./config.json');
const fs = require('fs');
const { prefix } = require('./config.json');
const du = require('discord.js-util');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

const client = new Discord.Client({
    intents: ["GUILDS", "GUILD_MEMBERS", "GUILD_PRESENCES", "GUILD_INTEGRATIONS", "GUILD_VOICE_STATES", "GUILD_MESSAGES", "GUILD_MESSAGE_REACTIONS", "DIRECT_MESSAGES", "DIRECT_MESSAGE_REACTIONS"],
});

client.on('ready', () => {
    console.log(`Ready logged in as ${client.user.tag}`)
});

client.commands = new Discord.Collection();
client.scommands = new Discord.Collection();
client.contextMenus = new Discord.Collection();
client.config = config;
client.color = config.color;

const rest = new REST({ version: '9' }).setToken(config.token);

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	// set a new item in the Collection
	// with the key as the command name and the value as the exported module
	client.commands.set(command.name, command);
}

const menus = {
	out: [

	],
	not_out: [
		new du.ContextMenuBuilder()
		.setName("Avatar")
		.setType("USER")
	]
}
const menusJSON = [];
const ContextCommandFiles = fs.readdirSync('./Context_Menus').filter(file => file.endsWith('.js'));

for (const file of ContextCommandFiles) {
	const command = require(`./Context_Menus/${file}`);
	// set a new item in the Collection
	// with the key as the command name and the value as the exported module
	client.contextMenus.set(command.name, command);
}
for(const menu of menus.not_out){
	menusJSON.push(menu.toJSON());
}

(async () => {
	try {
		console.log('Started refreshing application (/) commands.');

		await rest.put(
			Routes.applicationGuildCommands("869396819615027240", "868921019073708092"),
			{ body: menusJSON },
		);

		console.log('Successfully reloaded application (/) commands.');
	} catch (error) {
		console.error(error);
	}
})();

const commands = [];
const scommandFiles = fs.readdirSync('./slash_commands').filter(file => file.endsWith('.js'));

for (const file of scommandFiles) {
	const command = require(`./slash_commands/${file}`);
	// set a new item in the Collection
	// with the key as the command name and the value as the exported module
	client.scommands.set(command.name, command);
	commands.push(command)
}

client.on("interactionCreate", async interaction => {
	if(!interaction.isContextMenu()) return

	const menu = client.contextMenus.get(interaction.commandName);

	try {
		await menu.execute(client, interaction);
	} catch(e){
		console.log(e);
	}
})

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