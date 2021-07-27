const Discord = require('discord.js');

module.exports = {
    name: 'ping',
    description: `Gives the bots ping`,
    /**
     * 
     * @param {Discord.Message} message 
     * @param {Discord.Client} client 
     * @param {Array} args 
     */
    async execute(message, client, args) {
        const m = await message.channel.send({ content: `Pinging...` });

        const embed = new Discord.MessageEmbed()
        .setColor(client.color)
        .setDescription(`Pong!\n\Latency: ${Math.floor(message.createdTimestamp - m.createdTimestamp)}ms\nAPI Latency: ${Math.round(client.ws.ping)}ms `)
        m.edit({ content: '\u200B' });
        m.edit({ embeds: [embed] });
    }
}