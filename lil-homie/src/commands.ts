import 'dotenv/config'
import { APIApplicationCommandOptionChoice, ApplicationCommandChoicesOption, Interaction, Message, MessageFlags, SlashCommandBuilder, SlashCommandStringOption, TextChannel } from 'discord.js'
import { joinVoiceChannel, createAudioPlayer, NoSubscriberBehavior, createAudioResource, demuxProbe } from '@discordjs/voice';
import { google } from 'googleapis'
import ytdl from 'ytdl-core';
import 'ffmpeg-static'
import axios from 'axios';
import { profiles } from './profiles.js';
import { titleCase } from './helper.js';

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
		.setDescription('Play song')
		.addStringOption(option =>
			option.setName('song')
				.setDescription('Song Name')
				.setRequired(true)
			),
	execute: async (interaction) => {
		const userID : string = interaction.user.id || '1106791857654075402'
		const channelID : string = interaction.guild.members.cache.get(userID).voice.channel?.id
		const channel = interaction.guild.channels.cache.get(channelID || '1107578793507434520')
		const connection = joinVoiceChannel({ channelId: channel.id, guildId: channel.guild.id, adapterCreator: channel.guild.voiceAdapterCreator, selfDeaf: false, selfMute: false })
		
		const songInput : string = interaction.options.get('song').value

		const { YT_API_KEY } = process.env

		const player = createAudioPlayer({
			behaviors: {
				noSubscriber: NoSubscriberBehavior.Pause,
			},
		})

		const youtube = google.youtube({
			version: 'v3',
			key: YT_API_KEY,
		})

		const res = await youtube.search.list({
      "part": [
        'id'
      ],
      "q": songInput,
			"key": YT_API_KEY,
			"maxResults": 1
    })

		const songID : string = res.data.items.at(0).id.videoId || '' 

		const stream = ytdl(`https://www.youtube.com/watch?v=${songID}`, {filter: 'audioonly'} )

		connection.subscribe(player)
		player.play(createAudioResource(stream))
		player.on('error', error => console.log(`Oops, I whoopsied (${error})`))
		connection.on('error', error => console.log(`Oops, Conn whoopsied (${error})`))
		
		return interaction.reply(`I'm playing ${interaction.options.get('song').value}`)
	},
}

export const trnStats = {
	data: new SlashCommandBuilder()
		.setName('trn')
		.setDescription('Get TRN Stats')
		.addStringOption(option =>
			option.setName('game')
				.setDescription('Game')
				.setRequired(true)
			)
		.addStringOption(option =>
			option.setName('player')
				.setDescription('Player')
			),
	execute: async (interaction) => {
		const game : string = interaction.options.get('game').value
		const user : string = interaction.options.get('player').value

		const userIdentifier : string = `${profiles[game][user].username}-${profiles[game][user].identifier}`
		if (userIdentifier.split('-').length !== 2) return interaction.reply(`Error: I don't know ${user}'s overwatch username`)

		try {
			await axios.get(`https://owapi.io/profile/pc/us/${userIdentifier}`)
				.then(response => {
					if (response.data.private as boolean) return interaction.reply(`${user} Account is private :(`)
					const tankRank : string = response.data.competitive['tank']?.rank || 'None'
					const dpsRank : string = response.data.competitive['offense']?.rank || 'None'
					const suppRank : string = response.data.competitive['support']?.rank || 'None'
					console.log(response.data, tankRank, dpsRank, suppRank)

					const winRatioQuick : string = Math.round((response.data.games.quickplay['won'] / response.data.games.quickplay['played']) * 1000) / 10 + '%'
					const winRatioComp : string = Math.round((response.data.games.competitive['won'] / response.data.games.competitive['played']) * 1000) / 10 + '% Win Rate'
					const playtimeQuick : string = (response.data.playtime.quickplay).split(':')[0] + ' hours'
					const playtimeComp : string = (response.data.playtime.competitive).split(':')[0] + ' hours'

					return interaction.reply(`### ${titleCase(user)} Overwatch Stats\n>>> **Competitive**\n\tTank Rank\t\t\t${tankRank}\n\tDPS Rank\t\t\t${dpsRank}\n\tSupport Rank\t\t${suppRank}\n\n\tWin Ratio\t${winRatioComp}\n\tPlaytime\t${playtimeComp}\n\n**Quick Play**\n\tWin Ratio\t${winRatioQuick}\n\tPlaytime\t${playtimeQuick}`)
				})
		} catch (err) {
			console.log(err)
			return interaction.reply(err)
		}
		
		
	},
}

const playlists : { [ name: string ]: string[] } = {
	'melt': ['feast bludnymph', 'she knows jcole', 'softcore the neighborhood'],
	'lego': ['kryptonite three doors down', 'what ive done linkin park', 'numb linkin park', 'lovers on the sun david guetta', 'the pretender foo fighters', 'otherside red hot chilli peppers']
}

const getChoices = ( choices : string[] ) : { name: string, value: string }[] => {
	let choiceDict : { name: string, value: string }[] = []
	choices.map(choice => choiceDict.push({ name: choice, value: choice }))
	return choiceDict
}

export const queuePlaylist = {
	data: new SlashCommandBuilder()
		.setName('playlist')
		.setDescription('Queue preset songs')
		.addStringOption(option =>
			option.setName('playlist')
				.setDescription('Playlist')
				.setChoices(...getChoices(Object.keys(playlists)))
				.setRequired(true)
			)
		.addNumberOption(option =>
			option.setName('number')
				.setDescription('Number of Songs')
				.setRequired(true)
			),
	execute: async (interaction) => {
		const playlist : string = interaction.options.get('playlist').value || 'lego'
		const number : number = interaction.options.get('number').value || 3

		let playlistSongs : string[] = playlists[playlist]
		let selectedSongs : string[] = []

		for (let i = 0; i < number; i++) {
			const index : number = Math.floor(Math.random() * playlistSongs.length)
			selectedSongs.push(playlistSongs.splice(index, 1).at(0))
		}

		let channel : TextChannel = interaction.channel
		selectedSongs.forEach( song => {
			channel.send({ content: `p! play ${song}`, flags: MessageFlags.SuppressNotifications })//.then( (msg : Message) => msg.delete() )
		})

		return interaction.reply(`Queuing ${number} songs from playlist '${playlist}'`)
		
	},
}