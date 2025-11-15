const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('roblox')
        .setDescription('Look up a Roblox user')
        .addStringOption(option =>
            option.setName('username')
            .setDescription('The Roblox username to look up')
            .setRequired(true)
        ),

    async execute(interaction) {
        const username = interaction.options.getString('username');

        await interaction.deferReply();

        // Roblox v1 Username -> UserID API
        const response = await fetch('https://users.roblox.com/v1/usernames/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                usernames: [username],
                excludeBannedUsers: true
            })
        });

        const data = await response.json();

        // Error handling
        if (!data.data || data.data.length === 0) {
            return interaction.editReply(`❌ No Roblox user found for **${username}**.`);
        }

        const user = data.data[0];

        // Build profile URL
        const profileUrl = `https://www.roblox.com/users/${user.id}/profile`;

        // Avatar API (optional)
        const avatar = await fetch(`https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${user.id}&size=720x720&format=Png&isCircular=false`)
            .then(res => res.json());

        const avatarUrl = avatar.data?.[0]?.imageUrl;

        // Embed
        const embed = new EmbedBuilder()
            .setTitle(`${user.name} (${user.id})`)
            .setURL(profileUrl)
            .setDescription(`**Display Name:** ${user.displayName}\n**ID:** ${user.id}`)
            .setColor('#00b5e2');

        if (avatarUrl) embed.setThumbnail(avatarUrl);

        return interaction.editReply({ embeds: [embed] });
    }
};