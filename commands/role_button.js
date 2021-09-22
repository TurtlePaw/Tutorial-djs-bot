const Discord = require('discord.js');
const { MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu } = require('discord.js');

module.exports = {
    name: 'brole',
    /**
     * 
     * @param {Discord.Message} message 
     * @param {Discord.GuildMember} Member 
     * @param {Array} args
     */
    async execute(message, Member, args) {
        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('djs')
                    .setLabel('Discord.js')
                    .setStyle('SECONDARY'),
                new MessageButton()
                    .setStyle('SECONDARY')
                    .setLabel('Discord.py')
                    .setCustomId('dpy')
            )
        const roles_embed = new MessageEmbed()
            .setColor('BLUE')
            .setDescription('Use the buttons below to get roles!')
        //Send message
        const m = await message.channel.send({ embeds: [roles_embed], components: [row] });

        //Create collector
        const collector = m.createMessageComponentCollector({ filter: i => i.user.id === message.author.id, time: 60000 });

        collector.on('collect', async i => {
            //Get roles
            const rjs = i.guild.roles.cache.get('868921072924389427');
            const rpy = i.guild.roles.cache.get('868921179581333535');
            if (i.customId === 'djs') {
                if (i.member.roles.cache.has(rjs.id)) {
                    i.member.roles.remove(rjs.id)
                    i.reply({ content: `Removed the ${rjs} role!`, ephemeral: true })
                } else {
                    i.member.roles.add(rjs.id)
                    i.reply({ content: `Added the ${rjs} role!`, ephemeral: true })
                }
            } else if (i.customId === 'dpy') {
                if (i.member.roles.cache.has(rpy.id)) {
                    i.member.roles.remove(rpy.id)
                    i.reply({ content: `Removed the ${rpy} role!`, ephemeral: true })
                } else {
                    i.member.roles.add(rpy.id)
                    i.reply({ content: `Added the ${rpy} role!`, ephemeral: true })
                }
            }
        })
    }
}