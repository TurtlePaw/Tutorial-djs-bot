const { MessageButton, Message } = require("discord.js");
const { CommandInteraction, Client } = require("discord.js");
const { commandBuilder } = require("discordjsh");
const { v4 } = require("uuid");
const { showModal, Modal, TextInputComponent, ModalSubmitInteraction } = require("discord-modals");
const DiscordModals = require("discord-modals");

module.exports = {
    data: new commandBuilder()
    .setName(`modal`)
    .setDescription(`Discord Modals!`),
    /**
     * Executes the interaction.
     * @param {CommandInteraction} interaction The slash command.
     * @param {Client} client The discord client.
     */
    async execute(interaction, client){
        const CustomIds = {
            MODAL: `DISCORD_MODAL` + v4(),
            BUTTON: `EXECUTE_MODAL`
        }

        /**
         * @type {Message}
         */
        const SentMessage = await interaction.reply({
            content: `Click the button below for a modal.`,
            components: [
                {
                    type: 1,
                    components: [
                        new MessageButton()
                        .setCustomId(CustomIds.BUTTON)
                        .setLabel(`Show Modal`)
                        .setStyle("PRIMARY")
                    ]
                }
            ],
            fetchReply: true
        });

        await SentMessage.awaitMessageComponent({
            componentType: "BUTTON",
            filter: i => i.user.id == interaction.user.id
        }).then(async btn => {
            const modal = new Modal()
            .setCustomId(CustomIds.MODAL)
            .setTitle(`Apply for Mod`)
            .setComponents(
                new TextInputComponent()
                .setCustomId(`REASON`)
                .setLabel(`Why would you like to apply?`)
                .setRequired(true)
                .setStyle("LONG")
                .setPlaceholder(`Enter text...`),

            ); //Modals only support TextInputComponents right now!

            await showModal(modal, {
                client,
                interaction: btn
            });

            client.on("modalSubmit", async m => {
                const Reason = m.getTextInputValue("REASON");

                await m.reply({
                    content: `You applied for mod!\n\nReason: \`${Reason}\``
                });
            });
        });
    }
}