const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('gameinfo')
        .setDescription('Look up a Roblox game by its Universe ID.')
        .addStringOption(option =>
            option
                .setName('universeid')
                .setDescription('The Roblox Universe ID of the game.')
                .setRequired(true)
        ),

    async execute(interaction) {
        const universeId = interaction.options.getString('universeid');
        await interaction.deferReply();

        try {
            // Fetch game info
            const gameRes = await fetch(
                `https://games.roblox.com/v1/games?universeIds=${universeId}`
            );
            const gameData = await gameRes.json();

            if (!gameRes.ok || !gameData.data || !gameData.data.length) {
                return interaction.editReply("❌ Invalid game Universe ID or Roblox API error.");
            }

            const game = gameData.data[0];

            // Fetch game icon
            const iconRes = await fetch(
                `https://thumbnails.roblox.com/v1/games/icons?universeIds=${universeId}&size=150x150&format=Png`
            );
            const iconData = await iconRes.json();
            const icon =
                iconData.data && iconData.data.length ? iconData.data[0].imageUrl : null;

            const embed = new EmbedBuilder()
                .setTitle(game.name)
                .setColor('#660066')
                .setThumbnail(icon || null)
                .addFields(
                    { name: "Name", value: game.name || "Unknown", inline: true },
                    { name: "Creator", value: game.creator?.name || "Unknown", inline: true },
                    { name: "Universe ID", value: String(universeId), inline: true },
                    { name: "Playing", value: String(game.playing), inline: true },
                    { name: "Visits", value: String(game.visits), inline: true },
                    { name: "Favorites", value: String(game.favoritedCount || 0), inline: true },
                    {
                        name: "Description",
                        value: game.description?.slice(0, 1024) || "No description provided.",
                        inline: false
                    }
                )
                .setFooter({ text: "Roblox Game Lookup" });

            return interaction.editReply({ embeds: [embed] });

        } catch (err) {
            console.error(err);
            return interaction.editReply("⚠️ An error occurred while fetching Roblox game info.");
        }
    }
};
