const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('groupinfo')
        .setDescription('Look up a Roblox group by its group ID.')
        .addStringOption(option =>
            option
                .setName('groupid')
                .setDescription('The Roblox group ID.')
                .setRequired(true)
        ),

    async execute(interaction) {
        const groupId = interaction.options.getString('groupid');

        await interaction.deferReply();

        try {
            // Fetch group data
            const res = await fetch(`https://groups.roblox.com/v1/groups/${groupId}`);
            const data = await res.json();

            // Check for Roblox API errors
            if (!res.ok || data.errors) {
                return interaction.editReply("❌ Invalid group ID or Roblox API error.");
            }

            const embed = new EmbedBuilder()
                .setTitle(`Roblox Group: ${data.name}`)
                .setColor(0x00a2ff)
                .setThumbnail(`https://www.roblox.com/Thumbs/Asset.ashx?assetId=${data.emblemId}&width=150&height=150`)
                .addFields(
                    { name: "Group Name", value: data.name || "Unknown", inline: true },
                    { name: "Group ID", value: String(groupId), inline: true },
                    { name: "Owner", value: data.owner ? data.owner.username : "No owner", inline: false },
                    { name: "Member Count", value: String(data.memberCount || 0), inline: true },
                    { name: "Public?", value: data.publicEntryAllowed ? "Yes" : "No", inline: true },
                    { name: "Description", value: data.description || "No description provided.", inline: false }
                )
                .setFooter({ text: "Roblox Group Lookup" });

            return interaction.editReply({ embeds: [embed] });

        } catch (error) {
            console.error(error);
            return interaction.editReply("⚠️ An unexpected error occurred while fetching group info.");
        }
    }
};
