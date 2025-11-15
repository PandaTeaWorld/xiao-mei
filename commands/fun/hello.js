const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('hello')
		.setDMPermission(false)
		.setDescription('Hello Xiao Mei?'),
		category: 'fun',
	async execute(interaction) {
		interaction.reply("Hello pookies!");
	},

};