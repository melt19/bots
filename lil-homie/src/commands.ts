import 'dotenv/config'
import { SlashCommandBuilder, User } from 'discord.js'
import { joinVoiceChannel, createAudioPlayer, NoSubscriberBehavior, createAudioResource, demuxProbe, generateDependencyReport, StreamType, getVoiceConnection } from '@discordjs/voice';
// import { youtube } from '@googleapis/youtube'
import { google } from 'googleapis'
import ytdl from 'ytdl-core';
import opus from '@discordjs/opus'
import 'ffmpeg-static'


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

async function probeAndCreateResource(readableStream) {
	const { stream, type } = await demuxProbe(readableStream)
	console.log('stream', stream)
	console.log('type', type)
	return createAudioResource(stream, { inputType: type });
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
		const userID : string = '1106791857654075402' // interaction.user.id
		const channelID : string = interaction.guild.members.cache.get(userID).voice.channel?.id
		// console.log('channelID', channelID)
		const channel = interaction.guild.channels.cache.get(channelID || '1107578793507434520')
		const connection = joinVoiceChannel({ channelId: channel.id, guildId: channel.guild.id, adapterCreator: channel.guild.voiceAdapterCreator, selfDeaf: false, selfMute: false })
		
		const songInput : string = interaction.options.get('song').value

		const { YT_API_KEY } = process.env

		const player = createAudioPlayer({
			behaviors: {
				noSubscriber: NoSubscriberBehavior.Pause,
			},
		})

		const connection2 = await getVoiceConnection(channel.guild.id)

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

				const stream = ytdl(`https://www.youtube.com/watch?v=${songID}`, {filter: 'audioonly', dlChunkSize: 0} )

		connection.subscribe(player)
		player.play(createAudioResource(stream))
		// var buffers = []
		// stream.on('readable', ( buffer ) => {
		// 	for (;;) {
		// 		let buffer = stream.read()
		// 		if (!buffer) { break }
		// 		console.log(buffer)
		// 		connection.playOpusPacket(encoder.encode(buffer))
				
		// 		buffers.push(Buffer.from(buffer))
		// 	}
		// })

		// stream.on('end', ( ) => {
		// 	const streamBuffer = Buffer.concat(buffers)
		// 	// console.log('0x100000000', streamBuffer.length)
		// 	for (let i = 0; i < buffers.length; i++) {
		// 		// player.play(encoder.encode())
		// 		// connection.playOpusPacket(buffers[i])
		// 	}
		// 	// const aaa = 
		// 	// console.log(aaa) 
		// })


		// const resource = await probeAndCreateResource(vid)
		// console.log('vid', vid)
		// const stream = ytdl("https://www.youtube.com/watch?v=_ovdm2yX4MA", { filter: 'audioonly', dlChunkSize: 0 })
		// console.log('stream', stream)
		// connection.setSpeaking(true)
		// const buffers = [];

		// // node.js readable streams implement the async iterator protocol
		// for await (const data of stream) {
		// 	buffers.push(data);
		// }
		// const finalBuffer = Buffer.concat(buffers)

		// const ws = vid.pipe(fs.createWriteStream('tmp_song'))
		// console.log('ws', ws)
		// const buffer = Buffer.from(fs.readFileSync('tmp_song'))
		// console.log('buffer', buffer)

		// const encoder = new opus.OpusEncoder(48000, 2)
		// console.log(resource)
		// player.play(resource)

		return interaction.reply(`I'm playing ${interaction.options.get('song').value} -> ${res.data.items.at(0).id}`)
	},
}