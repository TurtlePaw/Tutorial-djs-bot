const Discord = require('discord.js');

module.exports = {
    name: "Avatar",
    /**
     * @param {Discord.ContextMenuInteraction} interaction 
     * @param {Discord.Client} client 
     */
    async execute(client, interaction){
        const avatar = interaction.user.displayAvatarURL({ format: "png", dynamic: true });

        const rows = [
            new Discord.MessageActionRow()
            .setComponents(
                new Discord.MessageButton()
                .setStyle("LINK")
                .setURL(avatar)
                .setLabel("PNG"),
                new Discord.MessageButton()
                .setStyle("LINK")
                .setURL(interaction.user.displayAvatarURL({ format: "jpg", dynamic: true }))
                .setLabel("JPG"),
                new Discord.MessageButton()
                .setStyle("LINK")
                .setURL(interaction.user.displayAvatarURL({ format: "webp", dynamic: true }))
                .setLabel("WEBP")
            )
        ]

        await interaction.reply({ components: rows, embeds: [
            new Discord.MessageEmbed()
            .setImage(avatar)
        ], ephemeral: true });
    }
}