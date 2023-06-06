import { SlashCommandBuilder } from 'discord.js'
import { joinVoiceChannel } from '@discordjs/voice';

export const ping = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
	execute: async (interaction) => {
		return interaction.reply('Pong!')
	},
}


export const server = {
	data: new SlashCommandBuilder()
		.setName('server')
		.setDescription('Display info about this server.'),
	execute: async (interaction) => {
		return interaction.reply(`Server name: ${interaction.guild.name}\nTotal members: ${interaction.guild.memberCount}`)
	},
}


export const joinVoice = {
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('Play song'),
	execute: async (interaction) => {
		console.log(interaction)
		const userID : string = '1106791857654075402' // interaction.user.id
		const channelID : string = interaction.guild.members.cache.get(userID).voice.channel?.id
		console.log('channelID', channelID)
		const channel = interaction.guild.channels.cache.get(channelID || '1107578793507434520')
		const connection = joinVoiceChannel({ channelId: channel.id, guildId: channel.guild.id, adapterCreator: channel.guild.voiceAdapterCreator })
		console.log('connection', connection)
		return interaction.reply(`YEet`)
	},
}