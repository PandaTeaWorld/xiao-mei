// handlers/buttonHandler.js
const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');

module.exports = async (interaction) => {
    const [action, userId, applicationType] = interaction.customId.split('-');
    const serverId = interaction.guild.id;

    switch (action) {
        case 'generated_button':
            const whoGenerated = await interaction.guild.members.fetch(userId);

            await interaction.reply({
                content: `This is a generated button by **${whoGenerated.user.tag}**.`,
                ephemeral: true,
            })
            break;
        default:
            console.log('Button not for application')
            break;
    }
};