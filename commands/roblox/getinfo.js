const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('getinfo')
        .setDescription('Get Roblox user info by User ID')
        .addStringOption(option =>
            option
                .setName('userid')
                .setDescription('The Roblox user ID')
                .setRequired(true)
        ),

    async execute(interaction) {
        const userId = interaction.options.getString('userid');

        await interaction.deferReply(); // In case API is slow

        try {
            // Fetch Roblox user info
            const res = await fetch(`https://users.roblox.com/v1/users/${userId}`);
            const data = await res.json();

            // Roblox API error example: { "errors": [...] }
            if (!res.ok || data.errors) {
                return interaction.editReply("❌ Invalid Roblox User ID or Roblox API error.");
            }

            const embed = new EmbedBuilder()
                .setTitle(`Roblox User Info: ${data.name}`)
                .setColor(0x00a2ff)
                .setThumbnail(`https://www.roblox.com/headshot-thumbnail/image?userId=${userId}&width=180&height=180&format=png`)
                .addFields(
                    { name: "Username", value: data.name, inline: true },
                    { name: "Display Name", value: data.displayName, inline: true },
                    { name: "ID", value: userId, inline: true },
                    { name: "Description", value: data.description || "No description.", inline: false },
                    { name: "Created", value: new Date(data.created).toLocaleDateString(), inline: false },
                )
                .setFooter({ text: "Roblox API" });

            await interaction.editReply({ embeds: [embed] });

        } catch (err) {
            console.error(err);
            interaction.editReply("⚠️ An error occurred while fetching Roblox data.");
        }
    }
};
